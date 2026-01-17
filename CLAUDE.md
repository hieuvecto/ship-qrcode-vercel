# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

QR Code Tàu Cá Đà Nẵng - A Next.js web application to manage ~5,000 fishing boats using Google Sheets as the database. Admins generate branded QR codes for each boat; public users scan QRs to view real-time boat details.

## Commands

- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Production build
- `npm run start` - Run production server
- `npm run lint` - Run ESLint
- `npm test` - Run Jest tests
- `npm run test:watch` - Run Jest tests in watch mode

## Tech Stack

- **Framework:** Next.js 16+ (App Router)
- **Styling:** TailwindCSS 4 + Shadcn UI
- **Database:** Google Sheets (via Google Sheets API)
- **QR Generation:** qrcode.react
- **Authentication:** NextAuth v4 (with Google OAuth)
- **Testing:** Jest + React Testing Library
- **Deployment:** Vercel

## Architecture

Uses Next.js App Router with the `app/` directory structure:

### Routes
- `/` - Home page
- `/boats/[id]` - Public boat detail page (accessed via QR scan)
- `/admin` - Admin dashboard (protected route)
- `/admin/login` - Admin login page
- `/admin/error` - Access denied error page

### Directory Structure
```
app/
├── (public)/boats/[id]/    # Public boat pages
├── admin/                  # Admin pages (auth-protected)
├── api/auth/              # NextAuth API routes
├── layout.tsx             # Root layout
└── globals.css            # Global styles

components/
├── ui/                    # Shadcn UI components
├── admin/                 # Admin-specific components
└── boats/                 # Boat display components

lib/
├── auth.ts               # NextAuth configuration
├── google-sheets.ts      # Google Sheets client
└── utils.ts             # Utility functions

actions/
└── boats.ts             # Server actions for boat data

types/
└── boat.ts              # TypeScript type definitions

locales/
├── vi.ts                # Vietnamese translations
└── en.ts                # English translations

database/
└── KT_TAUTHUYEN_sheet.pdf  # Schema reference document

__tests__/               # Jest tests
proxy.ts                 # Auth middleware (Next.js 16 proxy)
```

## Key Requirements

- **Language:** Vietnamese (`vi-VN`) as default, English as secondary
- **Font:** Use "Be Vietnam Pro" or "Inter" for Vietnamese character support
- **Data Fetching:** Server Actions with Next.js caching/revalidation (ISR ~60s)
- **QR Codes:** Must support logo embedding, high error correction level (H)

## Environment Setup

### Local Development (No Google Cloud Required)

For quick local testing without setting up Google Cloud:

```bash
cp .env.local.development .env.local
npm run dev
```

This enables:
- `USE_MOCK_DATA=true` - Uses 50 generated mock boats from `lib/mock-data.ts`
- `SKIP_AUTH=true` - Bypasses authentication, direct admin access
- Admin shows "DEV MODE" badge

**Note:** The mock data is dynamically generated using a generator function. To change the number of boats, edit `MOCK_BOAT_COUNT` in `lib/mock-data.ts`.

### Production Setup

1. Copy `.env.example` to `.env.local`
2. Configure Google Sheets API:
   - Create a service account in Google Cloud Console
   - Enable Google Sheets API
   - Add service account email to your Google Sheet with viewer permissions
   - Copy credentials to environment variables
3. Configure NextAuth:
   - Create OAuth 2.0 credentials in Google Cloud Console
   - Add authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
   - Generate NEXTAUTH_SECRET: `openssl rand -base64 32`
4. Add admin emails to `ADMIN_EMAILS` (comma-separated)
5. Set `USE_MOCK_DATA=false` and `SKIP_AUTH=false`

## Google Sheets Data Structure

Sheet name: `Boats` with columns (Vietnamese headers from PDF schema):

**Schema Reference:** `database/KT_TAUTHUYEN_sheet.pdf`

### Column Mapping (By Position)

**Important:** The application uses **column positions** (indices) instead of header names to avoid issues with header variations. The order of columns must match the schema exactly.

**Note:** The Google Sheet does not have an "ID" column. The `id` field in the code is derived from `serial_number` (Số TT) and used for QR codes and URLs.

| Position | Code Field | Vietnamese Header | PDF Column | Description |
|----------|-----------|-------------------|------------|-------------|
| A (0) | `serial_number` | Số TT | 3 | Serial number - **Primary identifier** |
| B (1) | `district` | Quận/huyện | 4 | District |
| C (2) | `boat_number` | Số ĐK | 5 | Registration number |
| D (3) | `registration_date` | Ngày ĐK | 6 | Registration date (dd/mm/yyyy) |
| E (4) | `boat_group` | Nhóm tàu | 10 | Boat group/classification |
| F (5) | `main_job` | Nghề chính | 11 | Main fishing job |
| G (6) | `side_job` | Nghề phụ | 12 | Side fishing job |
| H (7) | `boat_members` | Số thuyền viên | 13 | Number of crew members |
| I (8) | `owner_name` | Chủ phương tiện | 14 | Owner name |
| J (9) | `citizen_id` | Số CMND | 15 | Citizen ID number |
| K (10) | `phone` | Điện thoại | 17 | Phone number |
| L (11) | `address` | Địa chỉ | 18 | Address |
| M (12) | `inspection_number` | Số sổ đăng kiểm/Sổ QLKT | 23 | Inspection registration number |
| N (13) | `inspection_expiry_date` | Ngày hết hạn đăng kiểm | 26 | Inspection expiry date (dd/mm/yyyy) |
| O (14) | `boat_length` | Lmax (m) | 37 | Maximum boat length in meters |
| P (15) | `total_power` | Tổng công suất | 37 | Total engine power in CV |

### Example Boat Groups
- "Câu Rê" - Hook and gillnet fishing
- "Rê 7" - Gillnet fishing type 7
- "Công suất từ 400cv - nhỏ hơn 1000cv" - Power classification (400-1000 CV)

## Features

### Public Features
- View boat details via QR code scan
- ISR with 60-second revalidation
- Responsive boat information card
- Vietnamese language interface

### Admin Features
- Google OAuth authentication
- Paginated boat list (20 per page)
- Search by boat number or owner name
- Generate QR codes with high error correction (Level H)
- Download QR codes as PNG
- Protected routes with middleware

## QR Code Logo

To add your organization's logo to QR codes:
1. Place a PNG image at `public/images/danang-fishery-logo.png`
2. Recommended size: 200x200px or higher
3. Uncomment the `imageSettings` in `components/admin/qr-generator.tsx`

## Testing

- Unit tests for utilities and data transformation
- Component tests with snapshots
- Run tests: `npm test`
- Watch mode: `npm run test:watch`
