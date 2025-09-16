import { format} from 'date-fns';


export function getLocalDateObj(dt, timezoneOffset) {
  const localSeconds = dt + timezoneOffset;
  return new Date(localSeconds * 1000);
}

export function formatLocalHour(dt, timezoneOffset) {
  const d = getLocalDateObj(dt, timezoneOffset);
  const hours = d.getUTCHours();
  const ampm = hours >= 12 ? "PM" : "AM";
  const hour12 = ((hours + 11) % 12) + 1;
  return `${hour12} ${ampm}`;
}

export function formatLocalDate(dt, timezoneOffset, fmt = "EEEE, MMMM d") {
  const d = getLocalDateObj(dt, timezoneOffset);
  return format(d, fmt);
}

export function getLocalDateKey(dt, timezoneOffset) {
  const d = getLocalDateObj(dt, timezoneOffset);
  return d.toISOString().split("T")[0]; // yyyy-mm-dd
}