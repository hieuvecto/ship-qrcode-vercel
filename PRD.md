# PRD: QR Code Tàu Cá Đà Nẵng

## 1. Project Overview

A web application to manage ~5,000 fishing boats in Da Nang using
Google Sheets as the database. Admins generate branded QR codes for
each boat. Public users scan QRs to view real-time boat details.
**Primary Constraint:** The entire User Interface (UI) and User
Experience (UX) must support **Vietnamese** as the default language, English as secondary.

## 2. Tech Stack & Tools

- **Framework:** Next.js 16+ (App Router).
- **Deployment:** Vercel.
- **Styling:** TailwindCSS + Shadcn UI.
- **Font:** `next/font` (Use **"Be Vietnam Pro"** or "Inter" for full
  Vietnamese character support).
- **Database:** Google Sheets (via Google Sheets API).
- **QR Generation:** `qrcode.react` (Must support logo embedding and
  styling, high correction level).
- **Data Fetching:** NextJs Server Actions, Native `fetch` with Next.js caching/revalidation
  or `google-spreadsheet`.

## 3. User Roles

- **Admin:** Manages data in Google Sheets, accesses the Web App to
  generate/print QR codes.
- **Public User:** Scans QR codes on physical boats to view
  information.

## 4. Localization Requirements (New)

- **Default Language:** Vietnamese (`vi-VN`).
- **Secondary Language:** English (`en-US`).
- **Content:** All static text, buttons, labels, and messages must be
  in Vietnamese by default.
- **Date & Number Formats:** Follow Vietnamese conventions.
- **Language Toggle:** Optional language switcher for English, but
  Vietnamese remains primary.

## 5. Data Structure (Google Sheet)

- **Sheet Name:** `Boats`
- **Schema Reference:** `database/KT_TAUTHUYEN_sheet.pdf` (actual production schema)
- **Columns** (English keys in code → Vietnamese headers in Sheet):

### Registration Information
  - `id` (Auto-generated ID - **Critical** for permalinks and QR codes)
  - `serial_number` → "Số TT" (Column 3 - Serial number from sheet)
  - `district` → "Quận/huyện" (Column 4 - District)
  - `boat_number` → "Số ĐK" (Column 5 - Registration number, e.g., "ĐNa-90006-TS")
  - `registration_date` → "Ngày ĐK" (Column 6 - Date in dd/mm/yyyy format)
  - `boat_group` → "Nhóm tàu" (Column 10 - Boat classification/group)

### Fishing Operations
  - `main_job` → "Nghề chính" (Column 11 - Main fishing job)
  - `side_job` → "Nghề phụ" (Column 12 - Side fishing job)
  - `boat_members` → "Số thuyền viên" (Column 13 - Number of crew members)

### Owner Information
  - `owner_name` → "Chủ phương tiện" (Column 14 - Owner's name)
  - `citizen_id` → "Số CMND" (Column 15 - Citizen ID number)
  - `phone` → "Điện thoại" (Column 17 - Phone number)
  - `address` → "Địa chỉ" (Column 18 - Owner's address)

### Inspection & Technical Details
  - `inspection_number` → "Số sổ đăng kiểm/Sổ QLKT" (Column 23 - Inspection registration)
  - `inspection_expiry_date` → "Ngày hết hạn đăng kiểm" (Column 26 - Expiry date in dd/mm/yyyy)
  - `boat_length` → "Lmax (m)" (Column 37 - Maximum length in meters)
  - `total_power` → "Tổng công suất" (Column 37 - Total engine power in CV)

### Implementation Notes
- Mapping function implemented in `lib/google-sheets.ts` converts between English keys and Vietnamese headers
- Column positions explicitly documented for accurate data retrieval
- Example boat groups: "Câu Rê", "Rê 7", "Công suất từ 400cv - nhỏ hơn 1000cv"

## 6. Functional Requirements

### 6.1. Database Connection

- App must authenticate with Google Sheets API using Service Account
  credentials.
- **Sync:** Changes in Google Sheets must reflect in the app upon
  revalidation (Time-based or On-demand).

### 6.2. Admin Dashboard

- **Language:** Vietnamese Interface as default.
- **Access URL:** `/admin`
- **Authentication:** Use NextAuth for admin login by Google OAuth.
- **Boat List:** Display a paginated list of boats.
- **Search:** Filter by `boat_number` or `owner_name`.
- **QR Generator:**
  _ Action: Select a boat -> Generate QR.
  _ **QR Content:** URL to `https://[app-domain]/boats/[id]`.
  _ **Design:** Central logo (Da Nang Fishery icon), high contrast,
  professional look, high error correction level (H).
  _ **Export:** Download as PNG for printing.

### 6.3. Public Boat Detail Page (`/boats/[id]`)

- **URL Structure:** Use `/boats/[id]`.
- **Data Retrieval:** Queries Google Sheets by `id`.
- **Display:** Renders boat details in a mobile-responsive Shadcn card.
- **Error State:** Display "Không tìm thấy thông tin tàu" (Boat not found) if ID is invalid.

## 7. Key Logic Flows

**Flow 1: QR Code Persistence**

1.  Admin adds row: `id: 3`, `boat_number: "DNA-12345"`, `owner_name: "Mr. A"`, ... on Google Sheets.
2.  App generates QR: `myapp.com/boats/3`.
3.  Admin updates Sheet: Changes `owner_name` from "Mr. A" to "Mr. B".
4.  User scans the _original_ QR.
5.  App fetches `boat-A` -> Displays new owner "Mr. B".

## 8. Non-Functional Requirements

- **Performance:** Use Next.js ISR (Incremental Static Regeneration)
  with a generic revalidation time (e.g., 60 seconds) to minimize API quotas while keeping data fresh.
- **Accessibility:** High contrast text for outdoor readability
  (sunlight).
