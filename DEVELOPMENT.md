# Local Development Guide

This guide explains how to test the QR Code Tàu Cá Đà Nẵng system locally without setting up Google Cloud services.

## Quick Start (5 minutes)

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Set Up Mock Environment

```bash
# Copy the development configuration
cp .env.local.development .env.local
```

This creates a `.env.local` file with:
```env
USE_MOCK_DATA=true  # Use 50 generated mock boats instead of Google Sheets
SKIP_AUTH=true      # Bypass authentication
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 3: Start the Development Server

```bash
npm run dev
```

### Step 4: Test the Application

Open your browser and visit:

#### 🏠 Home Page
http://localhost:3000

**New!** The home page now includes a **demo QR code** you can scan with your phone:
- Working QR code for boat #1
- Step-by-step scanning instructions
- Direct link button as alternative
- No admin access needed to test!

#### 👤 Admin Dashboard (No login required!)
http://localhost:3000/admin

Features you can test:
- View list of 50 generated mock boats
- Search boats by number or owner name
- Pagination (20 boats per page - 3 pages total)
- Generate QR codes for any boat
- Download QR codes as PNG

#### 🚢 Boat Detail Page
http://localhost:3000/boats/1

Try different IDs: `/boats/2`, `/boats/3`, etc. (up to 50)

---

## Mock Data Details

### Generator Function

The mock data is **dynamically generated** using a smart generator function (`lib/mock-data.ts`):

**Features:**
- 🔢 Configurable count (currently 50 boats, easily adjustable)
- 🎲 Randomized realistic Vietnamese data
- 📊 Smart correlations (crew size matches boat power, specs match classification)
- 🌐 Data pools with Vietnamese names, streets, and fishing terminology

### What's Included

The generated data includes:
- **50 boats** with realistic Vietnamese data matching the actual PDF schema
- **5 districts**: Sơn Trà, Thanh Khê, Ngũ Hành Sơn, Liên Chiểu, Hải Châu
- **14 boat groups**: Câu Rê, Rê 5-10, Câu, Câu vồng, Lưới kéo, Lưới rê, power classifications
- **12 main fishing jobs**: Cá ngừ, Tôm hùm, Mực, Ghẹ, Cá cơm, Cá trích, etc.
- **15 side fishing jobs**: Including "Không" (none)
- **Vietnamese names**: Realistic combinations from 15 family names, 14 middle names, 30 given names
- **Realistic addresses**: 20 Da Nang streets with proper Vietnamese formatting
- **Phone numbers**: Valid Vietnamese mobile prefixes (090x, 093x, 097x, 032x, etc.)
- **Citizen IDs**: Realistic 12-digit Vietnamese ID formats

### Smart Generation Logic

The generator creates **correlated data** for realism:

| Boat Group | Crew Size | Length (m) | Power (CV) |
|------------|-----------|------------|------------|
| 90-400 CV | 3-5 | 8.0-14.0 | 90-390 |
| 400-1000 CV | 6-10 | 14.0-20.0 | 400-990 |
| 1000+ CV | 10-15 | 20.0-30.0 | 1000-2000 |
| Other groups | 4-12 | 10.0-25.0 | 250-1200 |

**Additional Intelligence:**
- Inspection expiry dates are 1-3 years after registration date
- Boat numbers use mixed formats: 70% ĐNa-XXXXX-TS, 30% ĐN-XXXXX
- Registration dates range from 2020-2025
- Addresses alternate between street addresses and ward (Tổ) addresses

---

## Development Mode Features

### Visual Indicators

When mock mode is enabled:
- Admin header shows a **"DEV MODE"** yellow badge
- User dropdown shows "Admin (Dev Mode)"
- No authentication required

### What Works

✅ View all boat details
✅ Search and pagination
✅ Generate QR codes
✅ Download QR codes as PNG
✅ Responsive design
✅ Vietnamese interface

### What Doesn't Work

❌ Real Google Sheets integration
❌ Real Google OAuth login
❌ Email-based admin whitelist

---

## Switching to Production Mode

When you're ready to test with real Google Cloud services:

### Step 1: Update Environment Variables

Edit `.env.local`:
```env
USE_MOCK_DATA=false
SKIP_AUTH=false

# Add your Google Cloud credentials
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=your-sheet-id

# Add your NextAuth credentials
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret

# Add admin emails
ADMIN_EMAILS=your-email@example.com
```

### Step 2: Restart Server

```bash
npm run dev
```

Now the application will:
- Connect to real Google Sheets
- Require Google OAuth login
- Check admin email whitelist

---

## Testing QR Codes

### Generate QR Code

1. Go to http://localhost:3000/admin
2. Click "Tạo QR" button on any boat
3. QR code appears with boat info

### Download QR Code

1. Click "Tải xuống" button in the QR dialog
2. PNG file downloads: `qr-{boat-number}-{id}.png`
3. QR includes boat number and owner name

### Scan QR Code

1. Use your phone's camera or QR scanner app
2. The QR code points to: `http://localhost:3000/boats/{id}`
3. For testing, you may need:
   - Expose localhost via ngrok or similar
   - Or manually visit the URL on your phone

---

## Troubleshooting

### Port Already in Use

If port 3000 is busy:
```bash
npm run dev -- -p 3001
```

Then update `NEXT_PUBLIC_APP_URL=http://localhost:3001`

### Mock Data Not Loading

Check that `.env.local` has:
```env
USE_MOCK_DATA=true
```

Restart the dev server after changing environment variables.

### Admin Access Denied

Make sure `.env.local` has:
```env
SKIP_AUTH=true
```

### QR Codes Not Working

Ensure `NEXT_PUBLIC_APP_URL` is set:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Customizing Mock Data

### Change the Number of Boats

To generate more or fewer boats, edit the configuration in `lib/mock-data.ts`:

```typescript
// Change this constant to generate different amounts
const MOCK_BOAT_COUNT = 100; // Default: 50
```

**Examples:**
- `MOCK_BOAT_COUNT = 20` - Quick testing with minimal data
- `MOCK_BOAT_COUNT = 100` - Realistic volume testing
- `MOCK_BOAT_COUNT = 1000` - Stress testing pagination and search

### Customize Data Pools

You can also customize the data pools to match your specific needs:

```typescript
// Add more districts
const DISTRICTS = ["Sơn Trà", "Thanh Khê", "Your District"];

// Add more boat groups
const BOAT_GROUPS = ["Câu Rê", "Your Custom Group"];

// Add more fishing jobs
const MAIN_JOBS = ["Đánh bắt cá ngừ", "Your Custom Job"];
```

### Generator Benefits

✅ **No manual data entry** - Just change one constant
✅ **Consistent data** - All generated boats follow the schema
✅ **Realistic correlations** - Crew size, boat specs, and power match logically
✅ **Easy testing** - Generate 1000 boats to test pagination performance
✅ **Vietnamese authenticity** - Names, addresses, and IDs are realistically formatted

---

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

---

## Building for Production

```bash
# Create production build
npm run build

# Test production build locally
npm start
```

Note: Production mode requires real Google Cloud credentials.

---

## Need Help?

- Check [README.md](./README.md) for full documentation
- Check [CLAUDE.md](./CLAUDE.md) for project structure
- Check [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) for technical details
