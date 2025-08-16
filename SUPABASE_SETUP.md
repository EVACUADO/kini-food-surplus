# Supabase Setup for Kini Food Surplus

## Environment Variables

Create a `.env.local` file in your project root with:

```bash
VITE_SUPABASE_URL=https://wdaexppdchctuwjqsnsj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkYWV4cHBkY2hjdHV3anFzbnNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4NDA5ODgsImV4cCI6MjA2OTQxNjk4OH0.dU4RYKytWzKF-GHaSOrIJtVKkdF5XXMRhmOk2pbjTVg
```

## Database Setup

1. Open your Supabase project dashboard
2. Go to SQL Editor
3. Run the contents of `supabase/signups.sql`

This will create:
- `customer_signups` table
- `merchant_signups` table
- Enable Row Level Security
- Set up policies for anonymous inserts

## Realtime Features

The signup forms now:
- Insert data into Supabase tables
- Subscribe to realtime inserts
- Log new signups to browser console

## Testing

1. Start the dev server: `npm run dev`
2. Open browser console
3. Submit a customer or merchant signup
4. Check console for realtime logs
5. Verify data appears in Supabase tables

## Notes

- Realtime subscriptions are minimal (console logging only)
- No unnecessary UI changes made
- Follows Git MVP principles

