import client from './client.js';

/**
 * List all users (super_admin only).
 */
export async function listUsers(params = {}) {
  const { data } = await client.get('/users', { params });
  return data;
}

/**
 * Create a new user.
 * @param {{ email, name, role, plant_id? }} payload
 */
export async function createUser(payload) {
  const { data } = await client.post('/users', payload);
  return data;
}

/**
 * Update user profile or role.
 * @param {string} userId
 * @param {object} payload - Partial user fields to update
 */
export async function updateUser(userId, payload) {
  const { data } = await client.patch(`/users/${userId}`, payload);
  return data;
}

/**
 * Deactivate (soft-delete) a user account.
 * @param {string} userId
 */
export async function deactivateUser(userId) {
  const { data } = await client.delete(`/users/${userId}`);
  return data;
}

/**
 * Trigger a password reset email for the given user.
 * @param {string} userId
 */
export async function resetPassword(userId) {
  const { data } = await client.post(`/users/${userId}/reset-password`);
  return data;
}
