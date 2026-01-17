# QR Code Tàu Cá Đà Nẵng

A Next.js web application for managing ~5,000 fishing boats in Da Nang using Google Sheets as the database. Admins can generate branded QR codes for each boat, and public users can scan QR codes to view real-time boat details.

## Features

### Public Features

- View boat details via QR code scan
- Incremental Static Regeneration (ISR) with 60-second revalidation
- Responsive boat information card
- Vietnamese language interface
- SEO-optimized with dynamic metadata

### Admin Features

- Google OAuth authentication with email whitelist
- Paginated boat list (20 boats per page)
- Search by boat number or owner name
- Generate QR codes with high error correction (Level H)
- Download QR codes as PNG images
- Protected routes with authentication middleware

## Tech Stack

- **Framework:** Next.js 16+ (App Router)
- **Styling:** TailwindCSS 4 + Shadcn UI
- **Database:** Google Sheets (via Google Sheets API)
- **Authentication:** NextAuth v5 (with Google OAuth)
- **QR Generation:** qrcode.react
- **Testing:** Jest + React Testing Library
- **Language:** TypeScript
- **Deployment:** Vercel

## Getting Started

### Option 1: Quick Start (5 Minutes - No Google Cloud Setup)

Perfect for local development and testing:

```bash
# Install dependencies
npm install

# Copy development config (enables mock data & skips auth)
cp .env.local.development .env.local

# Start the server
npm run dev
```

🎉 Done! Visit:
- **Home**: http://localhost:3000 - Features a working demo QR code you can scan with your phone!
- **Admin Dashboard**: http://localhost:3000/admin (no login needed)
- **Sample Boat**: http://localhost:3000/boats/1

See [DEVELOPMENT.md](./DEVELOPMENT.md) for detailed local development guide.

### Option 2: Full Setup (With Google Cloud)

For production deployment or testing with real data.

#### Prerequisites

- Node.js 20 or higher
- npm or yarn
- Google Cloud Project with:
  - Google Sheets API enabled
  - Service Account created
  - OAuth 2.0 credentials configured

#### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd ship-qrcode
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

4. Configure `.env.local` with your credentials:
   - Google Sheets service account credentials
   - NextAuth Google OAuth credentials
   - Admin emails (comma-separated)
   - NEXTAUTH_SECRET (generate with `openssl rand -base64 32`)

### Quick Start (Local Development Without Google Cloud)

For local testing without setting up Google Cloud services:

```bash
# Copy the development configuration
cp .env.local.development .env.local

# Start the development server
npm run dev
```

This will enable:
- **Mock Data Mode**: Uses 50+ sample boats instead of Google Sheets
- **Skip Authentication**: No Google OAuth required, direct access to admin

Access the application:
- Home: http://localhost:3000
- Admin Dashboard: http://localhost:3000/admin (no login required)
- Sample Boat: http://localhost:3000/boats/1

The admin dashboard will show a "DEV MODE" badge when authentication is bypassed.

### Google Cloud Setup

#### 1. Create Service Account for Google Sheets

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google Sheets API
4. Create a service account
5. Download JSON key file
6. Copy email and private key to `.env.local`

#### 2. Create OAuth 2.0 Credentials for NextAuth

1. In Google Cloud Console, go to APIs & Services > Credentials
2. Create OAuth 2.0 Client ID (Web application)
3. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Copy Client ID and Client Secret to `.env.local`

#### 3. Set up Google Sheet

1. Create a new Google Sheet
2. Name the first sheet "Boats"
3. Add the following column headers (in Vietnamese):
   - ID
   - Quận/Huyện
   - Số đăng ký
   - Ngày đăng ký
   - Loại tàu
   - Nghề chính
   - Nghề phụ
   - Số thuyền viên
   - Tên chủ tàu
   - CCCD/CMND
   - Địa chỉ
   - Số điện thoại
4. Share the sheet with your service account email (viewer permission)
5. Copy the Sheet ID from the URL to `.env.local`

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
├── app/                          # Next.js App Router
│   ├── (public)/boats/[id]/     # Public boat detail pages
│   ├── admin/                   # Admin dashboard (protected)
│   ├── api/auth/                # NextAuth API routes
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   └── globals.css              # Global styles
├── components/
│   ├── ui/                      # Shadcn UI components
│   ├── admin/                   # Admin components
│   └── boats/                   # Boat display components
├── lib/
│   ├── auth.ts                  # NextAuth configuration
│   ├── google-sheets.ts         # Google Sheets client
│   └── utils.ts                 # Utility functions
├── actions/
│   └── boats.ts                 # Server actions
├── types/
│   └── boat.ts                  # TypeScript types
├── locales/
│   ├── vi.ts                    # Vietnamese translations
│   └── en.ts                    # English translations
├── __tests__/                   # Jest tests
└── public/
    └── images/                  # Static images
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## Testing

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## QR Code Logo

To add your organization's logo to QR codes:

1. Place a PNG image at `public/images/danang-fishery-logo.png`
2. Recommended size: 200x200px or higher
3. Uncomment the `imageSettings` section in `components/admin/qr-generator.tsx`:

```typescript
imageSettings={{
  src: "/images/danang-fishery-logo.png",
  height: 50,
  width: 50,
  excavate: true,
}}
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Update `NEXT_PUBLIC_APP_URL` and `NEXTAUTH_URL` to your production domain
5. Update Google OAuth redirect URI to include your production domain
6. Deploy

### Environment Variables for Production

Make sure to set all environment variables from `.env.example` in your deployment platform.

## Documentation

- [DEVELOPMENT.md](./DEVELOPMENT.md) - **Local development guide with mock data**
- [CLAUDE.md](./CLAUDE.md) - Project guidelines for AI assistants
- [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) - Detailed implementation documentation
- [PRD.md](./PRD.md) - Product Requirements Document

## Support

For issues or questions:

1. **Quick Start:** See `DEVELOPMENT.md` for local testing without Google Cloud
2. Check the documentation in `CLAUDE.md`
3. Review the implementation plan in `IMPLEMENTATION_PLAN.md`
4. Run tests to verify functionality: `npm test`
5. Check Next.js logs for errors

## License

Private project - All rights reserved

## Credits

Built with Next.js 16, Shadcn UI, and Google Sheets
