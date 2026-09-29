export function initializeAuth(onAuthenticated) {
  const signupView = document.querySelector("#signup-view");
  const appView = document.querySelector("#app-view");
  const authForm = document.querySelector("#auth-form");
  const authToggle = document.querySelector("#auth-toggle");
  const usernameField = document.querySelector("#username-field");
  const formError = document.querySelector("#form-error");
  let isLogin = false;

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
    onAuthenticated();
  });
}