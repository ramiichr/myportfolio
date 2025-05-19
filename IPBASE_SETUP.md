# Ipbase.com Integration

To get accurate geolocation data for visitor tracking, we've integrated ipbase.com API.

## Setup Instructions

1. Sign up for an account at [ipbase.com](https://ipbase.com/)
2. Get your API key from your account dashboard
3. Add the API key to your environment variables:

```
IPBASE_API_KEY=your_api_key_here
```

- For local development, add this to your `.env.local` file
- For production on Vercel, add this as an environment variable in your Vercel project settings

## Notes

- If the `IPBASE_API_KEY` environment variable is not set, the system will fall back to using Vercel's built-in geolocation headers (less accurate)
- The free tier of ipbase.com has usage limits, so monitor your usage to avoid exceeding the quota
