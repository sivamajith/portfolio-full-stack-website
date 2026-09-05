import { useEffect, useState } from 'react';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
let settingsCache = null;
let settingsRequest = null;

export function clearSiteSettingsCache() {
  settingsCache = null;
  settingsRequest = null;
}

export function refreshSiteSettings() {
  clearSiteSettingsCache();
  return fetch(`${API_BASE}/settings`)
    .then((response) => response.ok ? response.json() : Promise.reject(new Error('Settings unavailable')))
    .then((data) => {
      settingsCache = data.settings;
      return settingsCache;
    });
}

export default function useSiteSettings() {
  const [settings, setSettings] = useState(settingsCache);

  useEffect(() => {
    const loadSettings = () => {
      if (settingsCache) {
        setSettings(settingsCache);
        return;
      }

      if (!settingsRequest) {
        settingsRequest = fetch(`${API_BASE}/settings`)
          .then((response) => response.ok ? response.json() : Promise.reject(new Error('Settings unavailable')))
          .then((data) => {
            settingsCache = data.settings;
            return settingsCache;
          })
          .finally(() => { settingsRequest = null; });
      }

      settingsRequest.then(setSettings).catch(() => {});
    };

    loadSettings();

    const handleSettingsUpdated = (e) => {
      clearSiteSettingsCache();
      if (e?.detail) {
        settingsCache = e.detail;
        setSettings(e.detail);
      }
      loadSettings();
    };

    window.addEventListener('portfolio-settings-updated', handleSettingsUpdated);
    return () => window.removeEventListener('portfolio-settings-updated', handleSettingsUpdated);
  }, []);

  return settings;
}
