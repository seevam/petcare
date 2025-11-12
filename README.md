# PawCare MVP - Pet Health Management Platform

A modern web application for pet owners to track vaccinations, manage health records, get AI-powered recommendations, and find pet services.

## Features

- 🐾 **Pet Profile Management** - Create detailed profiles for your pets with AI-powered breed identification
- 💉 **Vaccination Tracking** - Never miss a vaccination with automated email reminders
- 📋 **Health Records** - Store all medical records, documents, and notes securely
- 💊 **Medication Management** - Track medications and get dose reminders
- 🗺️ **Service Provider Directory** - Find nearby vets, groomers, and other pet services
- 🍖 **AI Diet Plans** - Get personalized nutrition recommendations
- 📧 **Smart Reminders** - Automated email notifications for important dates
- 🔒 **Secure Authentication** - Email/password and Google OAuth support

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL (via Supabase)
- **ORM:** Prisma
- **Authentication:** NextAuth.js
- **Styling:** Tailwind CSS + shadcn/ui
- **File Storage:** Vercel Blob
- **AI:** OpenAI GPT-4 Vision
- **Email:** Resend
- **Maps:** Google Maps JavaScript API
- **Deployment:** Vercel

## Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A Supabase account (free tier works)
- A Vercel account (for deployment)
- API keys for:
  - OpenAI
  - Resend
  - Google Maps
  - Google OAuth (optional)

## Local Development Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd pawcare-mvp
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual values:

```env
# Database (Supabase)
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# OpenAI
OPENAI_API_KEY="sk-your-key"

# Vercel Blob (get after deploying to Vercel)
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_your-token"

# Resend
RESEND_API_KEY="re_your-key"
EMAIL_FROM="PawCare <noreply@yourdomain.com>"

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="AIza-your-key"

# Cron Secret
CRON_SECRET="your-random-secret"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Set Up Database

#### Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the database to be ready
4. Go to Settings > Database
5. Copy the connection strings to your `.env.local`

#### Run Database Migrations

```bash
npx prisma generate
npx prisma db push
```

#### (Optional) Seed Database

```bash
npx prisma db seed
```

### 5. Set Up API Keys

#### OpenAI API Key

1. Go to [platform.openai.com](https://platform.openai.com)
2. Create an API key
3. Add to `.env.local`

#### Resend API Key

1. Go to [resend.com](https://resend.com)
2. Sign up and verify your email
3. Create an API key
4. Add domain for sending emails
5. Add to `.env.local`

#### Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Google Maps JavaScript API
4. Create credentials (API key)
5. Restrict key to your domain
6. Add to `.env.local`

#### Google OAuth (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Go to APIs & Services > Credentials
3. Create OAuth 2.0 Client ID
4. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
5. Add Client ID and Secret to `.env.local`

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 7. Create Your First Account

1. Click "Get Started" or go to `/register`
2. Create an account with email/password
3. Log in and start adding pets!

## Deployment to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables (copy from `.env.local`)
5. Click "Deploy"

### 3. Set Up Vercel Blob Storage

After deployment:

1. Go to your project in Vercel dashboard
2. Navigate to Storage
3. Create a new Blob store
4. Copy the `BLOB_READ_WRITE_TOKEN`
5. Add to environment variables in Vercel

### 4. Update Environment Variables

Update these in Vercel:

```env
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXT_PUBLIC_APP_URL="https://your-domain.vercel.app"
```

### 5. Set Up Cron Job Secret

Generate a random secret for cron job authentication:

```bash
openssl rand -base64 32
```

Add as `CRON_SECRET` in Vercel environment variables.

### 6. Configure Custom Domain (Optional)

1. Go to Settings > Domains in Vercel
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL`

## Database Management

### View Database

```bash
npx prisma studio
```

Opens a visual database browser at [http://localhost:5555](http://localhost:5555)

### Create Migration

```bash
npx prisma migrate dev --name your_migration_name
```

### Reset Database

```bash
npx prisma migrate reset
```

⚠️ **Warning:** This will delete all data!

## Project Structure

```
pawcare-mvp/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (auth)/           # Authentication pages
│   │   ├── (dashboard)/      # Protected dashboard pages
│   │   └── api/              # API routes
│   ├── components/
│   │   └── ui/               # shadcn/ui components
│   ├── lib/                  # Utility functions
│   ├── constants/            # App constants
│   └── types/                # TypeScript types
├── public/                   # Static assets
└── vercel.json              # Vercel configuration
```

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

## Key Features Implementation

### AI Pet Analysis

Uses OpenAI GPT-4 Vision to analyze pet photos and identify:
- Breed
- Age estimate
- Size category
- Physical characteristics

### Vaccination Reminders

Automated email reminders sent:
- 7 days before due date
- 3 days before due date
- 1 day before due date

### Service Provider Search

Uses Haversine formula to calculate distance and find nearby providers within specified radius.

## Security

- Passwords hashed with bcrypt
- JWT-based authentication
- HTTP-only cookies
- CSRF protection
- SQL injection prevention (Prisma)
- XSS protection
- Environment variable validation

## Performance

- Server-side rendering for better SEO
- Image optimization with Next.js Image
- Database query optimization
- Caching with React Query
- Code splitting and lazy loading

## Monitoring

- Check Vercel deployment logs
- Monitor database performance in Supabase
- Track API usage:
  - OpenAI: [platform.openai.com/usage](https://platform.openai.com/usage)
  - Resend: [resend.com/dashboard](https://resend.com/dashboard)
  - Google Maps: [console.cloud.google.com](https://console.cloud.google.com)

## Troubleshooting

### "Prisma Client not generated"

```bash
npx prisma generate
```

### "Cannot connect to database"

- Check DATABASE_URL in .env.local
- Verify Supabase project is active
- Ensure IP is whitelisted (if applicable)

### "NextAuth error"

- Ensure NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your domain
- Verify callback URLs for OAuth providers

### "File upload fails"

- Verify BLOB_READ_WRITE_TOKEN is set
- Check file size (max 10MB)
- Ensure Vercel Blob store is created

## Cost Estimates (1000 Users/Month)

| Service | Free Tier | Estimated Cost |
|---------|-----------|----------------|
| Vercel Hosting | Yes | $0-20/month |
| Supabase | 500MB, 50K users | $0-25/month |
| Vercel Blob | 1TB bandwidth free | $0-50/month |
| OpenAI API | Pay per use | ~$50/month |
| Resend Email | 3K emails/month | $0-20/month |
| Google Maps | $200 credit/month | $0 |
| **Total** | | **$0-165/month** |

## Contributing

This is an MVP. Contributions, issues, and feature requests are welcome!

## License

MIT

## Support

For support, email support@pawcare.app or open an issue in the repository.

---

Built with ❤️ for pet parents everywhere
