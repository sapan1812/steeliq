import client from './client.js';

/**
 * Fetch platform-wide KPI strip data.
 * Returns: { yield_rate, eaf_kwh_per_t, metallization_pct, tundish_temp, tap_to_tap_min }
 */
export async function getKPIs() {
  const { data } = await client.get('/analytics/kpis');
  return data;
}

/**
 * Fetch CastX module snapshot (quality, outliers, defects).
 */
export async function getCastXSnapshot() {
  const { data } = await client.get('/analytics/castx/snapshot');
  return data;
}

/**
 * Fetch EAF energy consumption timeseries.
 */
export async function getEAFEnergy() {
  const { data } = await client.get('/analytics/eaf/energy');
  return data;
}

/**
 * Fetch DRI gas consumption data.
 */
export async function getDRIGas() {
  const { data } = await client.get('/analytics/dri/gas');
  return data;
}

/**
 * Fetch active and recent alerts across all modules.
 */
export async function getAlerts() {
  const { data } = await client.get('/analytics/alerts');
  return data;
}
