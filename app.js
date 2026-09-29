const routes = [
  { id: "pebble", name: "The Pebble", type: "Boulder", grade: "V2", location: "Stanage, Peak District", rock: "Gritstone", time: 20, height: 3.5, gear: "Shoes, chalk, crash pad", image: "https://images.unsplash.com/photo-1767850815964-cf6423b9a5dc?auto=format&fit=crop&w=750&q=85", position: "center 43%" },
  { id: "ramp", name: "The Ramp", type: "Slab", grade: "V1", location: "Burbage, Peak District", rock: "Gritstone", time: 15, height: 3.1, gear: "Shoes, chalk, crash pad", image: "https://images.unsplash.com/photo-1775146967130-732521beac22?auto=format&fit=crop&w=750&q=85", position: "70% center" },
  { id: "overhang", name: "The Overhang", type: "Overhang", grade: "V3", location: "Curbar Edge, Peak District", rock: "Gritstone", time: 30, height: 4, gear: "Shoes, chalk, spotter", image: "https://images.unsplash.com/photo-1767850815964-cf6423b9a5dc?auto=format&fit=crop&w=750&q=85", position: "35% center" }
];

const signupView = document.querySelector("#signup-view");
const appView = document.querySelector("#app-view");
const authForm = document.querySelector("#auth-form");
const authToggle = document.querySelector("#auth-toggle");
const usernameField = document.querySelector("#username-field");
const formError = document.querySelector("#form-error");
let isLogin = false;
let savedRoutes = new Set(JSON.parse(localStorage.getItem("boulderate-saved") || "[]"));
let completedRoutes = new Set(JSON.parse(localStorage.getItem("boulderate-completed") || "[]"));

function routeCard(route, { showComplete = false, compact = false } = {}) {
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

function saveSets() {
  localStorage.setItem("boulderate-saved", JSON.stringify([...savedRoutes]));
  localStorage.setItem("boulderate-completed", JSON.stringify([...completedRoutes]));
}

function renderFeatured() {
  document.querySelector("#featured-route").innerHTML = routeCard(routes[0], { showComplete: true });
}

function renderCompleted() {
  const list = document.querySelector("#completed-list");
  const selected = routes.filter(route => completedRoutes.has(route.id));
  list.innerHTML = selected.map(route => routeCard(route)).join("");
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

authToggle.addEventListener("click", () => {
  isLogin = !isLogin;
  document.querySelector("#auth-heading").textContent = isLogin ? "Welcome Back" : "Create New Account";
  document.querySelector("#auth-switch-copy").textContent = isLogin ? "New to Boulderate?" : "Already registered?";
  authToggle.textContent = isLogin ? "Sign up here." : "Log in here.";
  document.querySelector("#auth-submit").textContent = isLogin ? "Log in" : "Sign up";
  usernameField.hidden = isLogin;
  document.querySelector("#username").required = !isLogin;
  document.querySelector("#password").autocomplete = isLogin ? "current-password" : "new-password";
  formError.textContent = "";
});

authForm.addEventListener("submit", event => {
  event.preventDefault();
  if (!authForm.reportValidity()) return;
  if (!isLogin && document.querySelector("#password").value.length < 8) {
    formError.textContent = "Use at least 8 characters for your password.";
    return;
  }
  formError.textContent = "";
  signupView.hidden = true;
  appView.hidden = false;
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
    if (savedRoutes.has(id)) savedRoutes.delete(id);
    else savedRoutes.add(id);
    saveSets();
    renderFeatured();
    if (!document.querySelector("#search-results").hidden) runRouteSearch();
  }
  if (completeButton) {
    const id = completeButton.dataset.complete;
    if (completedRoutes.has(id)) completedRoutes.delete(id);
    else completedRoutes.add(id);
    saveSets();
    renderFeatured();
  }
});

function runRouteSearch() {
  const type = document.querySelector("#type-filter").value;
  const grade = document.querySelector("#grade-filter").value;
  const location = document.querySelector("#location-filter").value.trim().toLowerCase();
  const maxTime = Number(document.querySelector("#time-filter").value) || Infinity;
  const maxHeight = Number(document.querySelector("#height-filter").value) || Infinity;
  const matches = routes.filter(route => (!type || route.type === type) && (!grade || route.grade === grade) && (!location || route.location.toLowerCase().includes(location)) && route.time <= maxTime && route.height <= maxHeight);
  const results = document.querySelector("#search-results");
  results.innerHTML = matches.length ? matches.map(route => routeCard(route, { showComplete: true })).join("") : "<p class=\"empty-state\">No routes match those filters. Try widening your search.</p>";
}

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
  const confirmed = window.confirm("Log out of Boulderate?");
  if (confirmed) {
    appView.hidden = true;
    signupView.hidden = false;
  }
});

renderFeatured();