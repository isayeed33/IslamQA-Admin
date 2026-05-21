import jwtDecode from "jwt-decode";
import axios from "axios";
import config from "../../config";

axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.baseURL = config.API_URL;

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    let message;
    if (error && error.response && error.response.status === 403) {
      window.location.href = "/access-denied";
    } else {
      switch (error?.response?.status) {
        case 401:
          message = "Invalid credentials";
          break;
        case 403:
          message = "Access Forbidden";
          break;
        case 404:
          message = "Sorry! the data you are looking for could not be found";
          break;
        default:
          message = error.response?.data?.message || error.message || error;
      }
      return Promise.reject(message);
    }
  }
);

const AUTH_SESSION_KEY = "islamqa_admin_user";

const setAuthorization = (token: string | null) => {
  if (token) axios.defaults.headers.common["Authorization"] = "JWT " + token;
  else delete axios.defaults.headers.common["Authorization"];
};

const getUserFromCookie = () => {
  const user = sessionStorage.getItem(AUTH_SESSION_KEY);
  return user ? (typeof user == "object" ? user : JSON.parse(user)) : null;
};

class APICore {
  get = (url: string, params: any) => {
    if (params) {
      const queryString = Object.keys(params).map(key => key + "=" + params[key]).join("&");
      return axios.get(`${url}?${queryString}`, params);
    }
    return axios.get(`${url}`, params);
  };

  create = (url: string, data: any) => axios.post(url, data);
  updatePatch = (url: string, data: any) => axios.patch(url, data);
  update = (url: string, data: any) => axios.put(url, data);
  delete = (url: string) => axios.delete(url);

  createWithFile = (url: string, data: any) => {
    const formData = new FormData();
    for (const k in data) formData.append(k, data[k]);
    return axios.post(url, formData, {
      headers: { ...axios.defaults.headers, "content-type": "multipart/form-data" },
    });
  };

  updateWithFile = (url: string, data: any) => {
    const formData = new FormData();
    for (const k in data) formData.append(k, data[k]);
    return axios.patch(url, formData, {
      headers: { ...axios.defaults.headers, "content-type": "multipart/form-data" },
    });
  };

  isUserAuthenticated = () => {
    const user = this.getLoggedInUser();
    if (!user) return false;
    try {
      const decoded: any = jwtDecode(user.token);
      const valid = decoded.exp > Date.now() / 1000;
      if (!valid) {
        // Token expired — clear stale session so it doesn't re-trigger navigate
        this.setLoggedInUser(null);
        setAuthorization(null);
      }
      return valid;
    } catch {
      this.setLoggedInUser(null);
      return false;
    }
  };

  setLoggedInUser = (session: any) => {
    if (session) sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
    else sessionStorage.removeItem(AUTH_SESSION_KEY);
  };

  getLoggedInUser = () => getUserFromCookie();

  setUserInSession = (modifiedUser: any) => {
    const userInfo = sessionStorage.getItem(AUTH_SESSION_KEY);
    if (userInfo) {
      const { token, user } = JSON.parse(userInfo);
      this.setLoggedInUser({ token, ...user, ...modifiedUser });
    }
  };
}

const user = getUserFromCookie();
if (user?.token) setAuthorization(user.token);

export { APICore, setAuthorization };
