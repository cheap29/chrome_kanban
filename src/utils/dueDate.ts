const DATE_FORMATTER = new Intl.DateTimeFormat("ja-JP", {
  month: "numeric",
  day: "numeric"
});

function toDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dateFromInputValue(value: string): Date | null {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;

  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return date;
}

export function todayDateInputValue(): string {
  return toDateInputValue(new Date());
}

export function tomorrowDateInputValue(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return toDateInputValue(tomorrow);
}

export function isTodayDueDate(dueDate?: string): boolean {
  return Boolean(dueDate && dueDate === todayDateInputValue());
}

export function formatDueDateLabel(dueDate?: string): string | undefined {
  if (!dueDate) return undefined;
  if (dueDate === todayDateInputValue()) return "今日";
  if (dueDate === tomorrowDateInputValue()) return "明日";

  const date = dateFromInputValue(dueDate);
  return date ? DATE_FORMATTER.format(date) : undefined;
}
