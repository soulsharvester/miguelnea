export function routeCard(route, { savedRoutes, completedRoutes }, { showComplete = false, compact = false } = {}) {
  const saved = savedRoutes.has(route.id);
  const completed = completedRoutes.has(route.id);
  return `<article class="route-card${compact ? " compact" : ""}">
    <h2 class="route-name">${route.name}</h2>
    <div class="route-main">
      <img class="route-photo" src="${route.image}" alt="A climber on a gritstone boulder" style="object-position:${route.position}">
      <div class="route-meta">
        <div class="meta-row"><strong>Type:</strong><span>${route.type}</span></div>
        <div class="meta-row"><strong>Grade:</strong><span>${route.grade}</span></div>
        <div class="meta-row"><strong>Location:</strong><span>${route.location}</span></div>
        <div class="meta-row"><strong>Rock:</strong><span>${route.rock}</span></div>
        <div class="meta-row"><strong>Time:</strong><span>${route.time} mins</span></div>
        <div class="meta-row"><strong>Height:</strong><span>${route.height} m</span></div>
      </div>
    </div>
    <div class="route-accent"></div>
    <div class="route-actions">
      <button class="save-button" type="button" data-save="${route.id}" aria-label="${saved ? "Unsave" : "Save"} ${route.name}" aria-pressed="${saved}"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3 8 3 3 7-7"></path></svg></button>
      <span>Save route</span><span class="gear">${route.gear}</span>
      ${showComplete ? `<button class="complete-button" type="button" data-complete="${route.id}" aria-pressed="${completed}">${completed ? "Sent" : "Mark sent"}</button>` : ""}
    </div>
  </article>`;
}