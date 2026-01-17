"use server";

import { unstable_cache } from "next/cache";
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

// Get single boat by ID
export async function getBoatById(id: string): Promise<Boat | null> {
  // Use mock data if enabled
  if (USE_MOCK_DATA) {
    const boat = mockBoats.find((b) => b.id === id);
    return boat || null;
  }

  return unstable_cache(
    async () => {
      try {
        logger.debug("Boats", `Fetching boat by ID: ${id}`);

        const sheet = await getBoatsSheet();

        logger.sheets.loadingRows(sheet.title, parseInt(process.env.GOOGLE_SHEET_HEADER_ROW || "1", 10));
        const rows = await sheet.getRows();
        logger.sheets.rowsLoaded(sheet.title, rows.length);

        // Search by serial_number (Số TT) using column index since the sheet doesn't have an "ID" column
        // Note: _rawData is a private property, but we use it to access columns by index
        const row = rows.find((r) => {
          const rawData = (r as any)._rawData || [];
          const serialNumber = rawData[COLUMN_INDICES.serial_number];
          return serialNumber !== null && serialNumber !== undefined && String(serialNumber).trim() === id;
        });

        if (!row) {
          logger.warn("Boats", `Boat with serial_number "${id}" not found`);
          return null;
        }

        logger.info("Boats", `Found boat: ID=${id}`);
        return rowToBoat(row);
      } catch (error) {
        logger.error("Boats", `Error fetching boat by ID: ${id}`, error);
        throw new Error("Failed to fetch boat");
      }
    },
    [`boat-${id}`],
    {
      revalidate: CACHE_REVALIDATE,
      tags: [`boat-${id}`],
    }
  )();
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

  const cacheKey = `boats-${page}-${limit}-${search || "all"}`;

  return unstable_cache(
    async () => {
      try {
        logger.debug("Boats", `Fetching boats: page=${page}, limit=${limit}, search="${search || "none"}"`);

        const sheet = await getBoatsSheet();

        logger.sheets.loadingRows(sheet.title, parseInt(process.env.GOOGLE_SHEET_HEADER_ROW || "1", 10));
        const rows = await sheet.getRows();
        logger.sheets.rowsLoaded(sheet.title, rows.length);

        // Convert all rows to boats
        let boats: Boat[] = rows.map((row) => rowToBoat(row));
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
    },
    [cacheKey],
    {
      revalidate: CACHE_REVALIDATE,
      tags: ["boats"],
    }
  )();
}

// Get total boat count
export async function getTotalBoatCount(): Promise<number> {
  // Use mock data if enabled
  if (USE_MOCK_DATA) {
    return mockBoats.length;
  }

  return unstable_cache(
    async () => {
      try {
        logger.debug("Boats", "Fetching total boat count");

        const sheet = await getBoatsSheet();

        logger.sheets.loadingRows(sheet.title, parseInt(process.env.GOOGLE_SHEET_HEADER_ROW || "1", 10));
        const rows = await sheet.getRows();
        logger.sheets.rowsLoaded(sheet.title, rows.length);

        logger.info("Boats", `Total boat count: ${rows.length}`);
        return rows.length;
      } catch (error) {
        logger.error("Boats", "Error fetching boat count", error);
        return 0;
      }
    },
    ["boat-count"],
    {
      revalidate: CACHE_REVALIDATE,
      tags: ["boats"],
    }
  )();
}
