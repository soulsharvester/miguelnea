export function filterRoutes(routes, { type, grade, location, maxTime, maxHeight }) {
  const query = location.trim().toLowerCase();
  return routes.filter(route =>
    (!type || route.type === type) &&
    (!grade || route.grade === grade) &&
    (!query || route.location.toLowerCase().includes(query)) &&
    route.time <= maxTime &&
    route.height <= maxHeight
  );
}