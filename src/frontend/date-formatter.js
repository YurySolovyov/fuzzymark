const formatter = new Intl.DateTimeFormat('en-US', {
  day: '2-digit',
  month: 'short',
  year: '2-digit',
});
const timeZone = formatter.resolvedOptions().timeZone;

const toInstant = (value) => {
  if (!Number.isSafeInteger(value)) {
    return undefined;
  }

  try {
    return Temporal.Instant.fromEpochMilliseconds(value);
  } catch {
    return undefined;
  }
};

const formatShortDate = (value) => {
  const instant = toInstant(value);

  if (!instant) {
    return '';
  }

  const date = instant.toZonedDateTimeISO(timeZone).toPlainDate();
  const parts = Object.fromEntries(
    formatter.formatToParts(date).map(({ type, value: partValue }) => [type, partValue]),
  );

  return `${parts.day} ${parts.month} ${parts.year}`;
};

const formatDateTime = (value) => {
  return toInstant(value)?.toString({ smallestUnit: 'millisecond' });
};

export { formatDateTime };
export default formatShortDate;
