import { describe, expect, it } from 'vitest';

import formatShortDate, { formatDateTime } from '../src/frontend/date-formatter.js';

describe('date formatter', () => {
  it('formats dates with the existing English short format', () => {
    const timeZone = new Intl.DateTimeFormat().resolvedOptions().timeZone;
    const value = Temporal.PlainDate.from('2024-09-07').toZonedDateTime(timeZone).epochMilliseconds;

    expect(formatShortDate(value)).toBe('07 Sep 24');
  });

  it('serializes instants with millisecond precision', () => {
    expect(formatDateTime(1710000000000)).toBe('2024-03-09T16:00:00.000Z');
  });

  it('handles missing and invalid timestamps', () => {
    expect(formatShortDate()).toBe('');
    expect(formatShortDate(Infinity)).toBe('');
    expect(formatDateTime()).toBeUndefined();
    expect(formatDateTime(Number.MAX_SAFE_INTEGER)).toBeUndefined();
  });
});
