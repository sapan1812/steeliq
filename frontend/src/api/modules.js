import client from './client.js';

// ─── Microapp / Module Registry ──────────────────────────────────────────────

/**
 * List all registered microapp modules.
 */
export async function listModules(params = {}) {
  const { data } = await client.get('/modules', { params });
  return data;
}

/**
 * Register a new microapp module.
 * @param {{ name, slug, description, module_type, config }} payload
 */
export async function createModule(payload) {
  const { data } = await client.post('/modules', payload);
  return data;
}

/**
 * Enable or disable a module.
 * @param {string} moduleId
 * @param {boolean} enabled
 */
export async function toggleModule(moduleId, enabled) {
  const { data } = await client.patch(`/modules/${moduleId}`, { enabled });
  return data;
}

// ─── Data Sources ─────────────────────────────────────────────────────────────

/**
 * List all configured data sources.
 */
export async function listDataSources(params = {}) {
  const { data } = await client.get('/datasources', { params });
  return data;
}

/**
 * Register a new data source.
 * @param {{ name, type, connection_string, credentials? }} payload
 */
export async function createDataSource(payload) {
  const { data } = await client.post('/datasources', payload);
  return data;
}

/**
 * Test connectivity for a data source.
 * @param {string} dataSourceId
 * @returns {{ success: boolean, latency_ms: number, message: string }}
 */
export async function testDataSource(dataSourceId) {
  const { data } = await client.post(`/datasources/${dataSourceId}/test`);
  return data;
}
