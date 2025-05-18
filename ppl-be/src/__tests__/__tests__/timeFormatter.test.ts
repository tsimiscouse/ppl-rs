import { getFormattedTime } from '../../utils/timeFormatter';

describe('getFormattedTime', () => {
  it('formats 15:30 UTC correctly to 3:30 PM', () => {
    const input = '1970-01-01T15:30:00.000Z';
    expect(getFormattedTime(input)).toBe('3:30 PM');
  });

  it('formats 00:00 UTC to 12:00 AM', () => {
    const input = '1970-01-01T00:00:00.000Z';
    expect(getFormattedTime(input)).toBe('12:00 AM');
  });

  it('formats 12:00 UTC to 12:00 PM', () => {
    const input = '1970-01-01T12:00:00.000Z';
    expect(getFormattedTime(input)).toBe('12:00 PM');
  });

  it('formats 01:05 UTC to 1:05 AM', () => {
    const input = '1970-01-01T01:05:00.000Z';
    expect(getFormattedTime(input)).toBe('1:05 AM');
  });

  it('accepts a Date object input', () => {
    const input = new Date('1970-01-01T22:45:00.000Z');
    expect(getFormattedTime(input)).toBe('10:45 PM');
  });
});
