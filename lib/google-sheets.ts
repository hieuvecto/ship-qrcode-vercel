import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import { Boat } from "@/types/boat";
import { logger } from "./logger";

// Configuration: Header row index (1-based, default is 1)
// If your sheet has headers in row 5, set GOOGLE_SHEET_HEADER_ROW=5 in .env
const HEADER_ROW_INDEX = parseInt(process.env.GOOGLE_SHEET_HEADER_ROW || "1", 10);

// Column mapping: Field names -> Column indices (0-based, where A=0, B=1, C=2, etc.)
// This approach uses column positions instead of header names to avoid issues with header variations
// Based on the schema from database/KT_TAUTHUYEN_sheet.pdf
// Note: "ID" column does not exist in the actual sheet; we use "Số TT" (serial_number) as the primary identifier
export const COLUMN_INDICES = {
  serial_number: 0,      // Column A: Số TT (Column 3 in original system) - Used as primary identifier
  district: 1,           // Column B: Quận/huyện (Column 4)
  boat_number: 2,        // Column C: Số ĐK (Column 5)
  registration_date: 3,  // Column D: Ngày ĐK (Column 6) (dd/mm/yyyy)
  boat_group: 4,         // Column E: Nhóm tàu (Column 10)
  main_job: 5,           // Column F: Nghề chính (Column 11)
  side_job: 6,           // Column G: Nghề phụ (Column 12)
  boat_members: 7,       // Column H: Số thuyền viên (Column 13)
  owner_name: 8,         // Column I: Chủ phương tiện (Column 14)
  citizen_id: 9,         // Column J: Số CMND (Column 15)
  phone: 10,             // Column K: Điện thoại (Column 17)
  address: 11,           // Column L: Địa chỉ (Column 18)
  inspection_number: 12, // Column M: Số sổ đăng kiểm/Sổ QLKT (Column 23)
  inspection_expiry_date: 13, // Column N: Ngày hết hạn đăng kiểm (Column 26) (dd/mm/yyyy)
  boat_length: 14,       // Column O: Lmax (m) (Column 37)
  total_power: 15,       // Column P: Tổng công suất (Column 37)
} as const;

// Legacy column mapping for reference (Vietnamese header names)
// Kept for documentation purposes - the code now uses COLUMN_INDICES instead
export const COLUMN_MAPPING = {
  serial_number: "Số TT",
  district: "Quận/huyện",
  boat_number: "Số ĐK",
  registration_date: "Ngày ĐK",
  boat_group: "Nhóm tàu",
  main_job: "Nghề chính",
  side_job: "Nghề phụ",
  boat_members: "Số thuyền viên",
  owner_name: "Chủ phương tiện",
  citizen_id: "Số CMND",
  phone: "Điện thoại",
  address: "Địa chỉ",
  inspection_number: "Số sổ đăng kiểm/Sổ QLKT",
  inspection_expiry_date: "Ngày hết hạn đăng kiểm",
  boat_length: "Lmax (m)",
  total_power: "Tổng công suất",
} as const;

// Initialize Google Sheets client
// Note: Cannot use 'use cache' here because GoogleSpreadsheet is a class instance (not serializable)
// Caching is handled at the server action level where data is transformed to plain objects
export async function getGoogleSheetsClient() {
  logger.sheets.connectionStart();

  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const sheetId = process.env.GOOGLE_SHEET_ID;

  logger.debug("GoogleSheets", "Environment check", {
    hasEmail: !!serviceAccountEmail,
    hasPrivateKey: !!privateKey,
    hasSheetId: !!sheetId,
    sheetId: sheetId ? `${sheetId.substring(0, 10)}...` : "missing",
  });

  if (!serviceAccountEmail || !privateKey || !sheetId) {
    const missing = [];
    if (!serviceAccountEmail) missing.push("GOOGLE_SERVICE_ACCOUNT_EMAIL");
    if (!privateKey) missing.push("GOOGLE_PRIVATE_KEY");
    if (!sheetId) missing.push("GOOGLE_SHEET_ID");

    logger.error("GoogleSheets", `Missing environment variables: ${missing.join(", ")}`);
    throw new Error("Missing required Google Sheets environment variables");
  }

  try {
    const serviceAccountAuth = new JWT({
      email: serviceAccountEmail,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const doc = new GoogleSpreadsheet(sheetId, serviceAccountAuth);

    // This is the expensive API call that we want to cache across requests
    await doc.loadInfo();

    logger.debug("GoogleSheets", "Document loaded", {
      title: doc.title,
      sheetCount: doc.sheetCount,
    });

    return doc;
  } catch (error) {
    logger.sheets.connectionError(error);
    throw error;
  }
}

// Transform sheet row to Boat object
// Note: We use serial_number (Số TT) as the id field since the sheet doesn't have an "ID" column
// This function uses column indices instead of header names to avoid issues with header variations
export function rowToBoat(row: any): Boat {
  // Access row data by column index using _rawData array
  // Note: _rawData is a private property, but we use it to access columns by index instead of header names
  const rawData = (row as any)._rawData || [];

  // Helper function to safely get cell value by index
  const getCellValue = (index: number): string => {
    const value = rawData[index];
    return value !== null && value !== undefined ? String(value).trim() : "";
  };

  const serialNumber = getCellValue(COLUMN_INDICES.serial_number);

  return {
    id: serialNumber, // Use serial_number as the primary identifier
    serial_number: serialNumber,
    district: getCellValue(COLUMN_INDICES.district),
    boat_number: getCellValue(COLUMN_INDICES.boat_number),
    registration_date: getCellValue(COLUMN_INDICES.registration_date),
    boat_group: getCellValue(COLUMN_INDICES.boat_group),
    main_job: getCellValue(COLUMN_INDICES.main_job),
    side_job: getCellValue(COLUMN_INDICES.side_job),
    boat_members: getCellValue(COLUMN_INDICES.boat_members),
    owner_name: getCellValue(COLUMN_INDICES.owner_name),
    citizen_id: getCellValue(COLUMN_INDICES.citizen_id),
    phone: getCellValue(COLUMN_INDICES.phone),
    address: getCellValue(COLUMN_INDICES.address),
    inspection_number: getCellValue(COLUMN_INDICES.inspection_number),
    inspection_expiry_date: getCellValue(COLUMN_INDICES.inspection_expiry_date),
    boat_length: getCellValue(COLUMN_INDICES.boat_length),
    total_power: getCellValue(COLUMN_INDICES.total_power),
  };
}

// Get boats sheet with header row configuration
// Note: Cannot use 'use cache' here because Sheet is a class instance (not serializable)
// Caching is handled at the server action level where data is transformed to plain objects
export async function getBoatsSheet() {
  const doc = await getGoogleSheetsClient();
  const sheetName = process.env.GOOGLE_SHEET_NAME || "Boats";

  logger.debug("GoogleSheets", `Looking for sheet: "${sheetName}"`);
  logger.debug("GoogleSheets", `Available sheets: ${Object.keys(doc.sheetsByTitle).join(", ")}`);

  const sheet = doc.sheetsByTitle[sheetName];

  if (!sheet) {
    logger.error("GoogleSheets", `Sheet "${sheetName}" not found. Available: ${Object.keys(doc.sheetsByTitle).join(", ")}`);
    throw new Error(`Sheet "${sheetName}" not found`);
  }

  logger.sheets.connectionSuccess(sheetName);

  // CRITICAL: Set the header row index before loading rows
  // This tells google-spreadsheet which row contains the headers
  if (HEADER_ROW_INDEX !== 1) {
    logger.info("GoogleSheets", `Setting header row to index ${HEADER_ROW_INDEX} (1-based row number)`);

    // Load the sheet with the correct header row
    await sheet.loadHeaderRow(HEADER_ROW_INDEX - 1); // API uses 0-based index

    // Log the actual headers found
    const headerValues = sheet.headerValues;
    logger.sheets.headerInfo(headerValues);
    logger.debug("GoogleSheets", `Total headers found: ${headerValues.length}`);
  }

  return sheet;
}
