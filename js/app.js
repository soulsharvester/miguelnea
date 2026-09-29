import { routes } from "./data/routes.js";
import { initializeAuth } from "./features/auth.js";
import { filterRoutes } from "./features/route-search.js";
import { loadRouteState, saveRouteState } from "./state/route-storage.js";
import { routeCard } from "./ui/route-card.js";

const appView = document.querySelector("#app-view");
const routeState = loadRouteState();

function renderFeatured() {
  document.querySelector("#featured-route").innerHTML = routeCard(routes[0], routeState, { showComplete: true });
}

function renderCompleted() {
  const selected = routes.filter(route => routeState.completedRoutes.has(route.id));
  document.querySelector("#completed-list").innerHTML = selected.map(route => routeCard(route, routeState)).join("");
  document.querySelector("#empty-completed").hidden = selected.length > 0;
}

function showScreen(name) {
  document.querySelectorAll(".screen-only").forEach(screen => {
    screen.hidden = screen.dataset.screen !== name;
  });
  document.querySelectorAll(".tab-button").forEach(tab => {
    const active = tab.dataset.tab === name;
    tab.classList.toggle("active", active);
    if (active) tab.setAttribute("aria-current", "page");
    else tab.removeAttribute("aria-current");
  });
  if (name === "completed") renderCompleted();
  document.querySelector(".app-screen").scrollTop = 0;
}

function runRouteSearch() {
  const maxTime = Number(document.querySelector("#time-filter").value) || Infinity;
  const maxHeight = Number(document.querySelector("#height-filter").value) || Infinity;
  const matches = filterRoutes(routes, {
    type: document.querySelector("#type-filter").value,
    grade: document.querySelector("#grade-filter").value,
    location: document.querySelector("#location-filter").value,
    maxTime,
    maxHeight
  });
  const results = document.querySelector("#search-results");
  results.innerHTML = matches.length
    ? matches.map(route => routeCard(route, routeState, { showComplete: true })).join("")
    : "<p class=\"empty-state\">No routes match those filters. Try widening your search.</p>";
}

initializeAuth(() => {
  renderFeatured();
  showScreen("discover");
});

document.querySelectorAll("[data-tab]").forEach(tab => {
  tab.addEventListener("click", () => showScreen(tab.dataset.tab));
});
document.querySelectorAll("[data-go]").forEach(button => {
  button.addEventListener("click", () => showScreen(button.dataset.go));
});

document.addEventListener("click", event => {
  const saveButton = event.target.closest("[data-save]");
  const completeButton = event.target.closest("[data-complete]");
  if (saveButton) {
    const id = saveButton.dataset.save;
    if (routeState.savedRoutes.has(id)) routeState.savedRoutes.delete(id);
    else routeState.savedRoutes.add(id);
    saveRouteState(routeState);
    renderFeatured();
    if (document.querySelector("#search-results").innerHTML) runRouteSearch();
  }
  if (completeButton) {
    const id = completeButton.dataset.complete;
    if (routeState.completedRoutes.has(id)) routeState.completedRoutes.delete(id);
    else routeState.completedRoutes.add(id);
    saveRouteState(routeState);
    renderFeatured();
  }
});

document.querySelector("#route-filter").addEventListener("submit", event => {
  event.preventDefault();
  runRouteSearch();
});

document.querySelector("#quick-search").addEventListener("keydown", event => {
  if (event.key === "Enter") {
    document.querySelector("#location-filter").value = event.currentTarget.value;
    showScreen("search");
    runRouteSearch();
  }
});

document.querySelector(".profile-button").addEventListener("click", () => {
  if (window.confirm("Log out of Boulderate?")) {
    appView.hidden = true;
    document.querySelector("#signup-view").hidden = false;
  }
});