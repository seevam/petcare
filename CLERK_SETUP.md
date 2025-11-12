# Clerk Authentication Setup Guide

This project uses [Clerk](https://clerk.com) for authentication. Follow these steps to set up Clerk for your PawCare MVP.

## Why Clerk?

- **Easy Integration**: Drop-in React components for sign-in/sign-up
- **Multiple Auth Methods**: Email/password, Google, Apple, GitHub, and more
- **Beautiful UI**: Customizable, pre-built authentication UI
- **User Management**: Built-in user dashboard and management
- **Webhooks**: Sync users to your database automatically
- **Free Tier**: 10,000 monthly active users

## Setup Steps

### 1. Create a Clerk Account

1. Go to [clerk.com](https://clerk.com) and sign up
2. Create a new application
3. Choose your authentication methods:
   - ✅ Email/Password (recommended)
   - ✅ Google OAuth (recommended)
   - ✅ Apple (for iOS deployment)
   - Add others as needed

### 2. Get Your API Keys

1. In your Clerk dashboard, go to **API Keys**
2. Copy the following keys:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`

3. Add to your `.env.local`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
```

### 3. Configure Redirect URLs

In Clerk Dashboard > **Paths**:

**Development (localhost:3000):**
- Sign-in URL: `/sign-in`
- Sign-up URL: `/sign-up`
- After sign-in URL: `/dashboard`
- After sign-up URL: `/dashboard`

**Production (your-domain.com):**
Update these when you deploy to production.

### 4. Setup Webhooks (User Sync)

Clerk needs to sync user data to your database. Set up a webhook:

1. In Clerk Dashboard, go to **Webhooks**
2. Click **Add Endpoint**
3. Enter your webhook URL:
   - **Development**: `https://your-ngrok-url.ngrok.io/api/webhooks/clerk`
   - **Production**: `https://your-domain.com/api/webhooks/clerk`
4. Subscribe to these events:
   - ✅ `user.created`
   - ✅ `user.updated`
   - ✅ `user.deleted`
5. Copy the **Signing Secret**
6. Add to `.env.local`:

```env
CLERK_WEBHOOK_SECRET="whsec_..."
```

#### Testing Webhooks Locally

Use [ngrok](https://ngrok.com) to expose your localhost:

```bash
# Install ngrok
npm install -g ngrok

# Start your dev server
npm run dev

# In another terminal, expose port 3000
ngrok http 3000

# Use the https URL in Clerk webhook settings
# Example: https://abc123.ngrok.io/api/webhooks/clerk
```

### 5. Customize Appearance (Optional)

You can customize Clerk's UI to match your brand:

1. Go to **Customization** in Clerk Dashboard
2. Update colors, logos, and styling
3. Or use the `appearance` prop in your code:

```typescript
<SignIn
  appearance={{
    elements: {
      formButtonPrimary: "bg-green-600 hover:bg-green-700",
      card: "shadow-xl",
    },
  }}
/>
```

## Environment Variables Reference

Add these to your `.env.local`:

```env
# Required
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# Required for user sync
CLERK_WEBHOOK_SECRET="whsec_..."
```

## How It Works

### 1. User Signs Up

```
User fills form → Clerk creates user → Webhook fires → User synced to DB
```

The webhook handler at `/api/webhooks/clerk` creates a user in your PostgreSQL database:

```typescript
await prisma.user.create({
  data: {
    id: clerkUserId,     // Clerk user ID
    email: email,
    name: firstName + lastName,
    imageUrl: profileImage,
  },
});
```

### 2. User Signs In

```
User logs in → Clerk creates session → Middleware protects routes → User ID available in API
```

### 3. Protected Routes

The middleware in `src/middleware.ts` protects all routes except:
- `/` (homepage)
- `/sign-in`
- `/sign-up`
- `/api/webhooks/clerk`

### 4. Getting User in API Routes

```typescript
import { auth } from "@clerk/nextjs";

export async function GET() {
  const { userId } = auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Use userId to query your database
  const pets = await prisma.pet.findMany({
    where: { userId },
  });

  return Response.json(pets);
}
```

### 5. Getting User in Server Components

```typescript
import { currentUser } from "@clerk/nextjs";

export default async function Page() {
  const user = await currentUser();

  if (!user) redirect("/sign-in");

  return <div>Hello {user.firstName}!</div>;
}
```

## Deployment to Production

### 1. Update Environment Variables in Vercel

1. Go to your Vercel project settings
2. Add all Clerk environment variables
3. Make sure to use **production** keys (pk_live_..., sk_live_...)

### 2. Update Webhook URL

1. In Clerk Dashboard > Webhooks
2. Update the endpoint URL to your production domain:
   ```
   https://your-domain.com/api/webhooks/clerk
   ```

### 3. Update Redirect URLs

1. In Clerk Dashboard > Paths
2. Update all URLs to use your production domain

## Troubleshooting

### Webhook Not Working

1. Check that `CLERK_WEBHOOK_SECRET` is set correctly
2. Verify the webhook URL is accessible
3. Check Clerk Dashboard > Webhooks > Logs for errors
4. Ensure events (`user.created`, etc.) are selected

### User Not Found in Database

1. Check webhook is firing (Clerk Dashboard > Webhooks > Logs)
2. Check your API logs for errors in `/api/webhooks/clerk`
3. Verify `DATABASE_URL` is set correctly
4. Check Prisma schema is pushed: `npx prisma db push`

### Authentication Not Working

1. Verify `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` starts with `pk_`
2. Verify `CLERK_SECRET_KEY` starts with `sk_`
3. Check middleware is running (should be at `src/middleware.ts`)
4. Clear cookies and try again

### Sign-in Page Not Found

1. Check the route is `/sign-in/[[...sign-in]]/page.tsx`
2. Verify middleware publicRoutes includes `/sign-in`
3. Restart dev server

## Additional Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Next.js Integration Guide](https://clerk.com/docs/quickstarts/nextjs)
- [Clerk Components](https://clerk.com/docs/components/overview)
- [Webhooks Reference](https://clerk.com/docs/integrations/webhooks/overview)

## Support

If you encounter issues:
1. Check [Clerk Status Page](https://status.clerk.dev)
2. Visit [Clerk Discord](https://clerk.com/discord)
3. Check [Clerk GitHub Discussions](https://github.com/clerkinc/javascript/discussions)
