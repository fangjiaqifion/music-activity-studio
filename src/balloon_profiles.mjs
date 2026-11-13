const KEY = "music-activity-studio:student-profiles:v1";
export function readProfiles(storage) {
  try {
    const value = JSON.parse(storage.getItem(KEY) || '{"names":[],"active":""}');
    const names = Array.isArray(value.names) ? [...new Set(value.names.filter(n => typeof n === "string" && n.trim() && n.length <= 24))].slice(0, 50) : [];
    return { names, active: names.includes(value.active) ? value.active : "" };
  } catch { return { names: [], active: "" }; }
}
export function saveProfiles(storage, value) {
  try { storage.setItem(KEY, JSON.stringify(value)); return true; }
  catch { return false; }
}
export function dateLabel(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {timeZone:"Asia/Shanghai", year:"numeric",month:"2-digit",day:"2-digit"}).format(date).replaceAll("-", "");
}
