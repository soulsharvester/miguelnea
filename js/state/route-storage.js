const SAVED_KEY = "boulderate-saved";
const COMPLETED_KEY = "boulderate-completed";

function readRouteIds(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return new Set(Array.isArray(value) ? value.filter(id => typeof id === "string") : []);
  } catch {
    return new Set();
  }
}

export function loadRouteState() {
  return {
    savedRoutes: readRouteIds(SAVED_KEY),
    completedRoutes: readRouteIds(COMPLETED_KEY)
  };
}

export function saveRouteState({ savedRoutes, completedRoutes }) {
  try {
    localStorage.setItem(SAVED_KEY, JSON.stringify([...savedRoutes]));
    localStorage.setItem(COMPLETED_KEY, JSON.stringify([...completedRoutes]));
  } catch {
    // The app remains usable when browser storage is unavailable.
  }
}