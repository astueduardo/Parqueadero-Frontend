import { makeRedirectUri } from "expo-auth-session";

export const GOOGLE_CLIENT_ID = "468037003282-9sgvb02374hn9m1hc5uh05djligqbblp.apps.googleusercontent.com";

export const REDIRECT_URI = makeRedirectUri({
    scheme: "mobile",
    // path: "auth/google" // Opcional
});