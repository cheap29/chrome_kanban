import { CalendarDays, ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import BunnyMascot from "./BunnyMascot";

const WEEKDAY_LABELS = ["日", "月", "火", "水", "木", "金", "土"];

function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function formatDateLabel(date: Date): string {
  return new Intl.DateTimeFormat("ja-JP", {
    month: "long",
    day: "numeric",
    weekday: "short"
  }).format(date);
}

function formatTimeLabel(date: Date): string {
  return new Intl.DateTimeFormat("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }).format(date);
}

function formatDateTimeValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function buildCalendarDays(date: Date): Date[] {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const startDate = new Date(firstDay);
  startDate.setDate(firstDay.getDate() - firstDay.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const calendarDate = new Date(startDate);
    calendarDate.setDate(startDate.getDate() + index);
    return calendarDate;
  });
}

function AnalogClock({ now }: { now: Date }) {
  const seconds = now.getSeconds();
  const minutes = now.getMinutes() + seconds / 60;
  const hours = (now.getHours() % 12) + minutes / 60;
  const hourRotation = hours * 30;
  const minuteRotation = minutes * 6;
  const secondRotation = seconds * 6;

  return (
    <div className="analog-clock" aria-label={`現在時刻 ${formatTimeLabel(now)}`}>
      <span className="clock-mark clock-mark-12">12</span>
      <span className="clock-mark clock-mark-3">3</span>
      <span className="clock-mark clock-mark-6">6</span>
      <span className="clock-mark clock-mark-9">9</span>
      <span className="clock-hand clock-hour-hand" style={{ transform: `rotate(${hourRotation}deg)` }} />
      <span className="clock-hand clock-minute-hand" style={{ transform: `rotate(${minuteRotation}deg)` }} />
      <span className="clock-hand clock-second-hand" style={{ transform: `rotate(${secondRotation}deg)` }}>
        <span className="second-hand-bunny">
          <BunnyMascot size={20} />
        </span>
      </span>
      <span className="clock-center" />
    </div>
  );
}

export default function TimeCalendarBar() {
  const [now, setNow] = useState(() => new Date());
  const [isOpen, setIsOpen] = useState(true);
  const today = useMemo(() => startOfToday(), [now]);
  const calendarDays = useMemo(() => buildCalendarDays(today), [today]);
  const monthLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("ja-JP", {
        year: "numeric",
        month: "long"
      }).format(today),
    [today]
  );

  useEffect(() => {
    const timerId = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timerId);
  }, []);

  return (
    <section className={`time-calendar-bar ${isOpen ? "is-open" : ""}`} aria-label="時計とカレンダー">
      <button
        className="time-calendar-summary"
        type="button"
        aria-expanded={isOpen}
        aria-controls="time-calendar-panel"
        onClick={() => setIsOpen((current) => !current)}
      >
        <AnalogClock now={now} />
        <span className="time-calendar-copy">
          <span className="current-time">{formatTimeLabel(now)}</span>
          <span className="current-date">{formatDateLabel(today)}</span>
        </span>
        <span className="calendar-toggle-icon" aria-hidden="true">
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </span>
      </button>

      {isOpen && (
        <div className="time-calendar-panel" id="time-calendar-panel">
          <div className="calendar-panel-header">
            <CalendarDays size={18} aria-hidden="true" />
            <span>{monthLabel}</span>
          </div>
          <div className="calendar-grid" aria-label={`${monthLabel}のカレンダー`}>
            {WEEKDAY_LABELS.map((weekday) => (
              <span className="calendar-weekday" key={weekday}>
                {weekday}
              </span>
            ))}
            {calendarDays.map((calendarDate) => {
              const isCurrentMonth = calendarDate.getMonth() === today.getMonth();
              const isToday = calendarDate.getTime() === today.getTime();

              return (
                <time
                  className={[
                    "calendar-day",
                    isCurrentMonth ? "" : "is-outside-month",
                    isToday ? "is-today" : ""
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  dateTime={formatDateTimeValue(calendarDate)}
                  key={calendarDate.toISOString()}
                >
                  {calendarDate.getDate()}
                </time>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
