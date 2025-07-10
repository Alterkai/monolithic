import isLoggedIn from "~/utils/isLoggedIn";

export default defineEventHandler(async (event) => {
  return isLoggedIn(getCookie(event, "auth-token"));
});
