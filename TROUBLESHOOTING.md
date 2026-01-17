# Troubleshooting Guide

This guide helps you debug common issues when working with the QR Code Tàu Cá Đà Nẵng application.

## Table of Contents
- [Google Sheets Issues](#google-sheets-issues)
- [Authentication Issues](#authentication-issues)
- [Development Mode](#development-mode)
- [Enabling Debug Logging](#enabling-debug-logging)

---

## Google Sheets Issues

### Error: "No values in the header row"

**Problem:** You see the error message:
```
Error: No values in the header row - fill the first row with header values before trying to interact with rows
```

**Cause:** Your Google Sheet has headers in a row other than row 1 (the library expects headers in the first row by default).

**Solution:** Configure the header row index in your `.env.local` file:

```env
# If your headers are in row 5
GOOGLE_SHEET_HEADER_ROW=5
```

The header row number is **1-based** (row 1, row 2, row 3, etc.).

**Example:**
- Headers in row 1: `GOOGLE_SHEET_HEADER_ROW=1` (default)
- Headers in row 5: `GOOGLE_SHEET_HEADER_ROW=5`
- Headers in row 10: `GOOGLE_SHEET_HEADER_ROW=10`

### Error: Sheet "Boats" not found

**Problem:** You see:
```
Error: Sheet "Boats" not found
```

**Cause:** The sheet name in your Google Spreadsheet doesn't match the expected name.

**Solution:** Set the correct sheet name in `.env.local`:

```env
# If your sheet is named "TauCa" instead of "Boats"
GOOGLE_SHEET_NAME=TauCa
```

**How to find available sheets:**
1. Enable logging (see [Enabling Debug Logging](#enabling-debug-logging))
2. Check the console output for: `Available sheets: Sheet1, Sheet2, ...`

### Missing or Incorrect Data

**Problem:** Data is missing or appears incorrect when loaded from Google Sheets.

**Debugging Steps:**

1. **Enable detailed logging:**
   ```env
   ENABLE_SHEETS_LOGGING=true
   ```

2. **Check the console output for:**
   - Header row being used
   - Headers found in the sheet
   - Number of rows loaded
   - Column mapping

3. **Verify your columns are in the correct order:**

   The application uses **column positions** (indices) instead of column names, so the order is critical:

   | Position | Column | Vietnamese Name |
   |----------|--------|-----------------|
   | A (1st) | Serial Number | Số TT |
   | B (2nd) | District | Quận/huyện |
   | C (3rd) | Boat Number | Số ĐK |
   | D (4th) | Registration Date | Ngày ĐK |
   | E (5th) | Boat Group | Nhóm tàu |
   | F (6th) | Main Job | Nghề chính |
   | G (7th) | Side Job | Nghề phụ |
   | H (8th) | Boat Members | Số thuyền viên |
   | I (9th) | Owner Name | Chủ phương tiện |
   | J (10th) | Citizen ID | Số CMND |
   | K (11th) | Phone | Điện thoại |
   | L (12th) | Address | Địa chỉ |
   | M (13th) | Inspection Number | Số sổ đăng kiểm/Sổ QLKT |
   | N (14th) | Inspection Expiry | Ngày hết hạn đăng kiểm |
   | O (15th) | Boat Length | Lmax (m) |
   | P (16th) | Total Power | Tổng công suất |

   **Important Notes:**
   - The application reads data by column position, not by header names
   - Column headers can have minor variations in spelling or spacing without causing issues
   - The order of columns must match the table above
   - The application does not require an "ID" column - it uses "Số TT" (serial number) as the primary identifier

4. **Verify column order:**
   - The application reads data by column position (A, B, C, D, etc.)
   - Column headers can vary, but the **order must be correct**
   - First column (A) must be "Số TT" (serial number)
   - Remaining columns must follow the order shown in the table above

---

## Authentication Issues

### Cannot Access Admin Dashboard

**Problem:** Redirected to login page when accessing `/admin`

**Solution for Development:**

```env
SKIP_AUTH=true
```

This bypasses authentication entirely (development only).

**Solution for Production:**

1. Ensure your email is in the admin list:
   ```env
   ADMIN_EMAILS=your-email@example.com,another-admin@example.com
   ```

2. Verify Google OAuth credentials are set:
   ```env
   GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-client-secret
   NEXTAUTH_SECRET=your-nextauth-secret
   ```

3. Generate NEXTAUTH_SECRET if needed:
   ```bash
   openssl rand -base64 32
   ```

---

## Development Mode

### Using Mock Data

To test without Google Sheets:

```env
USE_MOCK_DATA=true
SKIP_AUTH=true
```

**What this does:**
- Uses 50 generated Vietnamese boat samples
- No Google Sheets API calls
- No authentication required
- Perfect for local development and testing

### Switching to Production Mode

To test with real Google Sheets:

```env
USE_MOCK_DATA=false
SKIP_AUTH=false
GOOGLE_SHEET_HEADER_ROW=5
ENABLE_SHEETS_LOGGING=true
# ... add your Google credentials
```

---

## Enabling Debug Logging

### Full Logging Configuration

Add to `.env.local`:

```env
# Enable detailed Google Sheets logging
ENABLE_SHEETS_LOGGING=true

# Development mode also enables basic logging
NODE_ENV=development
```

### What Gets Logged

With `ENABLE_SHEETS_LOGGING=true`, you'll see:

**Connection logs:**
```
[INFO] [GoogleSheets] Initializing Google Sheets connection...
[INFO] [GoogleSheets] Successfully connected to sheet: Boats
```

**Header configuration:**
```
[INFO] [GoogleSheets] Setting header row to index 5 (1-based row number)
[DEBUG] [GoogleSheets] Sheet headers: ID, Số TT, Quận/huyện, ...
```

**Data loading:**
```
[DEBUG] [GoogleSheets] Loading rows from "Boats" (header row: 5)...
[INFO] [GoogleSheets] Loaded 150 rows from "Boats"
```

**Search operations:**
```
[DEBUG] [GoogleSheets] Searching for: "ĐN-12345"
[DEBUG] [GoogleSheets] Search "ĐN-12345" returned 1 results
```

**Boat operations:**
```
[INFO] [Boats] Using PRODUCTION mode - Data will be fetched from Google Sheets
[DEBUG] [Boats] Fetching boat by ID: 1
[INFO] [Boats] Found boat: ID=1
```

### Reading Logs

**Development server:**
```bash
npm run dev
# Logs appear in terminal
```

**Production build:**
```bash
npm run build
npm start
# Check application logs
```

---

## Common Error Messages

### "Missing required Google Sheets environment variables"

**Missing variables:** Check which ones are missing in the error message.

**Required variables:**
```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=...
GOOGLE_PRIVATE_KEY=...
GOOGLE_SHEET_ID=...
```

### "Failed to fetch boats"

**Enable logging to see the actual error:**
```env
ENABLE_SHEETS_LOGGING=true
```

Common causes:
1. **Incorrect credentials** - Verify service account email and private key
2. **Sheet not shared** - Share the Google Sheet with the service account email
3. **Wrong sheet ID** - Double-check the GOOGLE_SHEET_ID
4. **Wrong sheet name** - Set GOOGLE_SHEET_NAME correctly
5. **Wrong header row** - Set GOOGLE_SHEET_HEADER_ROW correctly

---

## Quick Diagnostic Checklist

When encountering Google Sheets issues:

- [ ] Set `ENABLE_SHEETS_LOGGING=true` in `.env.local`
- [ ] Check header row number in your sheet (1, 2, 3, ...?)
- [ ] Set `GOOGLE_SHEET_HEADER_ROW=X` to match
- [ ] Verify sheet name matches `GOOGLE_SHEET_NAME`
- [ ] Check that service account has access to the sheet
- [ ] Verify column headers match expected Vietnamese headers exactly
- [ ] Restart the development server after changing `.env.local`
- [ ] Check console output for detailed error messages

---

## Need More Help?

If you're still experiencing issues:

1. **Enable full logging** and share the console output
2. **Check the logs** for specific error messages
3. **Verify your `.env.local`** settings against `.env.example`
4. **Test with mock data first** (`USE_MOCK_DATA=true`) to isolate the issue

Remember to **restart your development server** after changing environment variables!
