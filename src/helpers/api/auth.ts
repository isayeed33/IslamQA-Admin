import { APICore } from "./apiCore";

const api = new APICore();

function login(params: { username: string; password: string }) {
  return api.create("/login/", params);
}

function logout() {
  return api.create("/logout/", {});
}

function signup(params: { fullname: string; email: string; password: string }) {
  return api.create("/register/", params);
}

function forgotPassword(params: { username: string }) {
  return api.create("/forgot-password/", params);
}

export { login, logout, signup, forgotPassword };
