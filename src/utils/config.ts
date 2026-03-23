import { makeRedirectUri } from "expo-auth-session";
export const REDIRECT_URI = makeRedirectUri({
    scheme: "mobile",
});