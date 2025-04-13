# Visitor Tracking System

This directory contains the visitor tracking data for the portfolio website.

## Files

- `visitors.json`: Contains all visitor information in JSON format. This file is automatically created and managed by the application.

## Data Structure

Each visitor entry contains the following information:

```json
{
  "id": "unique-uuid",
  "ip": "visitor-ip-address",
  "userAgent": "browser-user-agent",
  "referrer": "referring-url-or-null",
  "timestamp": "ISO-date-string",
  "path": "/visited-page-path",
  "country": "country-code",
  "region": "region-name",
  "city": "city-name",
  "timezone": "timezone-string",
  "latitude": 12.345,
  "longitude": 67.890
}
```

## Notes

- The file is limited to storing the most recent 1000 visitors to prevent excessive file size.
- Geolocation data is obtained using free IP lookup services and may not always be available or accurate.
- All visitor data can be viewed and managed through the admin dashboard.