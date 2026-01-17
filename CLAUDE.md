# CLAUDE.md

QR Code Tàu Cá Đà Nẵng - Next.js app to manage ~5,000 fishing boats using Google Sheets. Admins generate QR codes; users scan to view boat details.

## Tech Stack

Next.js 16 (App Router) • TailwindCSS 4 • Google Sheets API • NextAuth v4 • qrcode.react

## Commands

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm test` - Run tests

## Key Implementation Details

### Caching (Rate Limit Prevention)

**Critical:** `getAllBoatRows()` in `actions/boats.ts` is the ONLY function with `use cache`. It caches Google Sheets row data for 60s. All server actions call this shared function, ensuring `sheet.getRows()` runs max once per minute.

- `cacheComponents: true` enabled in `next.config.ts`
- Don't use `use cache` on functions returning class instances (GoogleSpreadsheet, Sheet)
- Route segment configs (`revalidate`, `dynamic`) incompatible with `cacheComponents`

### Google Sheets Schema

Uses **column positions** (0-indexed), not header names. Schema: `database/KT_TAUTHUYEN_sheet.pdf`

Primary ID: `serial_number` (Column A) - used for QR codes and URLs

### Development Mode

```bash
cp .env.local.development .env.local
npm run dev
```

Enables `USE_MOCK_DATA=true` and `SKIP_AUTH=true`. Edit `MOCK_BOAT_COUNT` in `lib/mock-data.ts` to change boat count.

### Production Setup

1. Google Sheets: Service account → Enable API → Add to sheet with viewer permissions
2. NextAuth: OAuth credentials → Set `ADMIN_EMAILS` → Generate `NEXTAUTH_SECRET`
3. Set `USE_MOCK_DATA=false` and `SKIP_AUTH=false`

## Notes

- Language: Vietnamese (vi-VN) primary
- Logger: No timestamps (incompatible with `cacheComponents`)
- QR Logo: Place at `public/images/danang-fishery-logo.png`, uncomment in `components/admin/qr-generator.tsx`
