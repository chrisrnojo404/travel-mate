export function formatTimestamp(isoString: string): string {
  const date = new Date(isoString);

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}
