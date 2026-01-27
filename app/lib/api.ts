import { getAuth } from "firebase/auth";

export async function authenticatedFetch(
  url: string,
  options: RequestInit = {},
) {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User is not authentcated");
  }

  const token = await user.getIdToken();

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  return fetch(url, {
    ...options,
    headers,
  });
}
