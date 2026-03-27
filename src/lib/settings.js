import { supabase } from './supabase';

// Cache settings in memory to avoid repeated DB calls per session
let settingsCache = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch all site_settings rows as a { key: value } map.
 * Falls back to env vars if the table is missing or empty.
 */
export async function getSettings() {
  const now = Date.now();
  if (settingsCache && now - cacheTimestamp < CACHE_TTL) {
    return settingsCache;
  }

  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('key, value');

    if (error) throw error;

    const map = {};
    (data || []).forEach((row) => {
      map[row.key] = row.value;
    });

    settingsCache = map;
    cacheTimestamp = now;
    return map;
  } catch (err) {
    console.warn('⚠️  Could not fetch site_settings, falling back to env vars:', err.message);
    return {};
  }
}

/**
 * Get a single setting value with env-var fallback.
 * @param {string} key      - Setting key, e.g. 'cloudinary_cloud_name'
 * @param {string} envVar   - Env-var fallback name, e.g. 'VITE_CLOUDINARY_CLOUD_NAME'
 */
export async function getSetting(key, envVar) {
  const settings = await getSettings();
  return settings[key] || import.meta.env[envVar] || '';
}

/**
 * Upsert a single setting (admin only).
 */
export async function upsertSetting(key, value, label = '') {
  const { error } = await supabase
    .from('site_settings')
    .upsert({ key, value, label }, { onConflict: 'key' });

  if (error) throw error;

  // Invalidate cache
  settingsCache = null;
  cacheTimestamp = 0;
}

/**
 * Invalidate the in-memory settings cache so the next call re-fetches.
 */
export function invalidateSettingsCache() {
  settingsCache = null;
  cacheTimestamp = 0;
}
