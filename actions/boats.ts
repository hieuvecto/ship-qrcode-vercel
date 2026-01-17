"use server";

import { cacheLife } from "next/cache";
import { Boat, BoatListResponse } from "@/types/boat";
import { getBoatsSheet, rowToBoat, COLUMN_INDICES } from "@/lib/google-sheets";
import { mockBoats } from "@/lib/mock-data";
import { logger } from "@/lib/logger";

// Cache duration: 60 seconds
const CACHE_REVALIDATE = 60;

// Check if we should use mock data (for local development)
const USE_MOCK_DATA = process.env.USE_MOCK_DATA === "true";

// Log configuration on startup
if (USE_MOCK_DATA) {
  logger.info("Boats", "Using MOCK DATA mode - Google Sheets will not be accessed");
} else {
  logger.info("Boats", "Using PRODUCTION mode - Data will be fetched from Google Sheets");
}

// Shared cached function to fetch all boat rows from Google Sheets
// This function is called by all server actions to ensure sheet.getRows() is called only once per minute
// Returns serializable raw row data (arrays) instead of Row class instances
async function getAllBoatRows() {
  "use cache";
  cacheLife({ revalidate: CACHE_REVALIDATE });

  logger.debug("Boats", "Fetching all boat rows from Google Sheets (cached)");

  const sheet = await getBoatsSheet();

  logger.sheets.loadingRows(sheet.title, parseInt(process.env.GOOGLE_SHEET_HEADER_ROW || "1", 10));
  const rows = await sheet.getRows();
  logger.sheets.rowsLoaded(sheet.title, rows.length);

  // Extract raw data from Row instances to make them serializable
  // Each row's _rawData contains the cell values as an array
  const serializedRows = rows.map((row) => {
    return (row as any)._rawData || [];
  });

  logger.info("Boats", `Cached ${serializedRows.length} boat rows (will revalidate in ${CACHE_REVALIDATE}s)`);

  return serializedRows;
}

// Helper function to convert raw row data to Boat object
// Similar to rowToBoat but works with raw arrays instead of Row instances
function rawDataToBoat(rawData: any[]): Boat {
  const getCellValue = (index: number): string => {
    const value = rawData[index];
    return value !== null && value !== undefined ? String(value).trim() : "";
  };

  const serialNumber = getCellValue(COLUMN_INDICES.serial_number);

  return {
    id: serialNumber,
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

// Get single boat by ID
export async function getBoatById(id: string): Promise<Boat | null> {
  // Handle build-time placeholder (used for cacheComponents validation)
  if (id === "__build_placeholder__") {
    return null;
  }

  // Use mock data if enabled
  if (USE_MOCK_DATA) {
    const boat = mockBoats.find((b) => b.id === id);
    return boat || null;
  }

  try {
    logger.debug("Boats", `Fetching boat by ID: ${id}`);

    // Use shared cached rows data
    const rowsData = await getAllBoatRows();

    // Search by serial_number (Số TT) using column index
    const rawData = rowsData.find((row) => {
      const serialNumber = row[COLUMN_INDICES.serial_number];
      return serialNumber !== null && serialNumber !== undefined && String(serialNumber).trim() === id;
    });

    if (!rawData) {
      logger.warn("Boats", `Boat with serial_number "${id}" not found`);
      return null;
    }

    logger.info("Boats", `Found boat: ID=${id}`);
    return rawDataToBoat(rawData);
  } catch (error) {
    logger.error("Boats", `Error fetching boat by ID: ${id}`, error);
    throw new Error("Failed to fetch boat");
  }
}

// Get paginated boats with search
export async function getBoats(
  page: number = 1,
  limit: number = 20,
  search?: string
): Promise<BoatListResponse> {
  // Use mock data if enabled
  if (USE_MOCK_DATA) {
    let boats = [...mockBoats];

    // Apply search filter
    if (search && search.trim()) {
      const searchLower = search.toLowerCase().trim();
      boats = boats.filter(
        (boat) =>
          boat.boat_number.toLowerCase().includes(searchLower) ||
          boat.owner_name.toLowerCase().includes(searchLower)
      );
    }

    const total = boats.length;
    const totalPages = Math.ceil(total / limit);

    // Apply pagination
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedBoats = boats.slice(start, end);

    return {
      boats: paginatedBoats,
      total,
      page,
      limit,
      totalPages,
    };
  }

  try {
    logger.debug("Boats", `Fetching boats: page=${page}, limit=${limit}, search="${search || "none"}"`);

    // Use shared cached rows data
    const rowsData = await getAllBoatRows();

    // Convert all rows to boats
    let boats: Boat[] = rowsData.map((row) => rawDataToBoat(row));
    logger.debug("Boats", `Converted ${boats.length} rows to boat objects`);

    // Apply search filter
    if (search && search.trim()) {
      const searchLower = search.toLowerCase().trim();
      logger.sheets.searchStart(search);

      boats = boats.filter(
        (boat) =>
          boat.boat_number.toLowerCase().includes(searchLower) ||
          boat.owner_name.toLowerCase().includes(searchLower)
      );

      logger.sheets.searchResults(search, boats.length);
    }

    const total = boats.length;
    const totalPages = Math.ceil(total / limit);

    // Apply pagination
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedBoats = boats.slice(start, end);

    logger.info("Boats", `Returning ${paginatedBoats.length} boats (page ${page}/${totalPages}, total: ${total})`);

    return {
      boats: paginatedBoats,
      total,
      page,
      limit,
      totalPages,
    };
  } catch (error) {
    logger.error("Boats", "Error fetching boats", error);
    throw new Error("Failed to fetch boats");
  }
}

// Get total boat count
export async function getTotalBoatCount(): Promise<number> {
  // Use mock data if enabled
  if (USE_MOCK_DATA) {
    return mockBoats.length;
  }

  try {
    logger.debug("Boats", "Fetching total boat count");

    // Use shared cached rows data
    const rowsData = await getAllBoatRows();

    logger.info("Boats", `Total boat count: ${rowsData.length}`);
    return rowsData.length;
  } catch (error) {
    logger.error("Boats", "Error fetching boat count", error);
    return 0;
  }
}
