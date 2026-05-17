import client from './client.js';

/**
 * Authenticate user with email and password.
 * @returns {{ access_token: string, user: object }}
 */
export async function login(email, password) {
  const { data } = await client.post('/auth/login', { email, password });
  return data;
}

/**
 * Exchange a refresh token for a new access token.
 */
export async function refreshToken(refresh_token) {
  const { data } = await client.post('/auth/refresh', { refresh_token });
  return data;
}

/**
 * Invalidate the current session on the backend.
 */
export async function logout(refresh_token) {
  const { data } = await client.post('/auth/logout', { refresh_token });
  return data;
}

/**
 * Fetch the authenticated user's profile.
 */
export async function getMe() {
  const { data } = await client.get('/auth/me');
  return data;
}
