// Timezone utility functions
export const timezones = {
  "UTC": "UTC",
  "America/New_York": "Eastern Time",
  "America/Chicago": "Central Time", 
  "America/Denver": "Mountain Time",
  "America/Los_Angeles": "Pacific Time",
  "Europe/London": "London",
  "Europe/Paris": "Paris",
  "Asia/Tokyo": "Tokyo",
} as const;

export type Timezone = keyof typeof timezones;

export class TimezoneService {
  // Convert date to user's timezone
  static convertToUserTimezone(date: Date, userTimezone: Timezone): Date {
    try {
      const utcDate = new Date(date.toISOString());
      const userDate = new Date(utcDate.toLocaleString("en-US", { timeZone: userTimezone }));
      return userDate;
    } catch (error) {
      // Fallback to UTC if timezone is invalid
      return date;
    }
  }

  // Get current time in user's timezone
  static getCurrentTimeInTimezone(timezone: Timezone): string {
    try {
      return new Date().toLocaleString("en-US", { 
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch (error) {
      return new Date().toISOString();
    }
  }

  // Format date for display in user's timezone
  static formatDateForTimezone(date: Date, timezone: Timezone, format: 'short' | 'long' = 'short'): string {
    try {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: timezone,
        year: 'numeric',
        month: format === 'long' ? 'long' : '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      };
      
      return date.toLocaleString("en-US", options);
    } catch (error) {
      return date.toISOString();
    }
  }

  // Get timezone offset in hours
  static getTimezoneOffset(timezone: Timezone): number {
    try {
      const now = new Date();
      const utc = new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
      const target = new Date(utc.toLocaleString("en-US", { timeZone: timezone }));
      return (target.getTime() - utc.getTime()) / (1000 * 60 * 60);
    } catch (error) {
      return 0;
    }
  }
}
