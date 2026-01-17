// Simple logger utility for development debugging
const IS_DEV = process.env.NODE_ENV === "development";
const ENABLE_SHEETS_LOGGING = process.env.ENABLE_SHEETS_LOGGING === "true";

type LogLevel = "info" | "warn" | "error" | "debug";

function log(level: LogLevel, context: string, message: string, data?: any) {
  if (!IS_DEV && !ENABLE_SHEETS_LOGGING) return;

  // Only use timestamps in development mode
  // In Next.js 16 with cacheComponents, new Date() causes build errors in cached functions
  const prefix = `[${level.toUpperCase()}] [${context}]`;

  switch (level) {
    case "error":
      console.error(prefix, message, data ? data : "");
      break;
    case "warn":
      console.warn(prefix, message, data ? data : "");
      break;
    case "debug":
      if (ENABLE_SHEETS_LOGGING) {
        console.debug(prefix, message, data ? data : "");
      }
      break;
    default:
      console.log(prefix, message, data ? data : "");
  }
}

export const logger = {
  info: (context: string, message: string, data?: any) => log("info", context, message, data),
  warn: (context: string, message: string, data?: any) => log("warn", context, message, data),
  error: (context: string, message: string, data?: any) => log("error", context, message, data),
  debug: (context: string, message: string, data?: any) => log("debug", context, message, data),

  // Specialized loggers for Google Sheets operations
  sheets: {
    connectionStart: () => log("debug", "GoogleSheets", "Initializing Google Sheets connection..."),
    connectionSuccess: (sheetTitle: string) =>
      log("info", "GoogleSheets", `Successfully connected to sheet: ${sheetTitle}`),
    connectionError: (error: any) =>
      log("error", "GoogleSheets", "Failed to connect to Google Sheets", error),

    loadingRows: (sheetTitle: string, headerRow: number) =>
      log("debug", "GoogleSheets", `Loading rows from "${sheetTitle}" (header row: ${headerRow})...`),
    rowsLoaded: (sheetTitle: string, count: number) =>
      log("info", "GoogleSheets", `Loaded ${count} rows from "${sheetTitle}"`),
    rowsError: (sheetTitle: string, error: any) =>
      log("error", "GoogleSheets", `Error loading rows from "${sheetTitle}"`, error),

    headerInfo: (headers: string[]) =>
      log("debug", "GoogleSheets", `Sheet headers: ${headers.join(", ")}`),

    searchStart: (query: string) =>
      log("debug", "GoogleSheets", `Searching for: "${query}"`),
    searchResults: (query: string, count: number) =>
      log("debug", "GoogleSheets", `Search "${query}" returned ${count} results`),

    cacheHit: (key: string) =>
      log("debug", "Cache", `Cache hit: ${key}`),
    cacheMiss: (key: string) =>
      log("debug", "Cache", `Cache miss: ${key}`),
  },
};
