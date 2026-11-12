// Read again at save time so sequential completions in different tabs are retained.
export function createHistoryStore(getStorage = () => window.localStorage) {
  const key = "music-activity-studio.demo.v1";
  function snapshot() {
    try {
      const storage = getStorage();
      const raw = storage.getItem(key);
      const history = raw === null ? [] : JSON.parse(raw);
      if (!Array.isArray(history)) throw new Error("Invalid saved history");
      return { history: history.slice(-100), storage };
    } catch {
      return { history: [], storage: null };
    }
  }
  return {
    read: () => snapshot().history,
    append(entry, fallback = []) {
      const current = snapshot();
      const history = [
        ...(current.storage ? current.history : fallback),
        entry,
      ].slice(-100);
      if (!current.storage) return { history, stored: false };
      try {
        current.storage.setItem(key, JSON.stringify(history));
        return { history, stored: true };
      } catch {
        return { history, stored: false };
      }
    },
  };
}
