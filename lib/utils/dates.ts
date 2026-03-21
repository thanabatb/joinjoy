export function formatEventDate(dateInput: string): string {
  const date = new Date(dateInput);

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}
