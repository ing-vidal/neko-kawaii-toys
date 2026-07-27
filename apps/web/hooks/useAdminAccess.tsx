'use client';

import { useEffect, useState } from 'react';

const ADMIN_ACCESS_KEY = 'neko-admin-access';
const ADMIN_PASSWORD_KEY = 'neko-admin-password';
const DEFAULT_PASSWORD = 'admin123';

export function useAdminAccess() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setAuthenticated(window.localStorage.getItem(ADMIN_ACCESS_KEY) === 'true');
  }, []);

  const unlock = (password: string) => {
    if (typeof window === 'undefined') return false;
    const storedPassword = window.localStorage.getItem(ADMIN_PASSWORD_KEY) || DEFAULT_PASSWORD;
    const normalized = password.trim();
    if (normalized === storedPassword) {
      window.localStorage.setItem(ADMIN_ACCESS_KEY, 'true');
      setAuthenticated(true);
      return true;
    }
    return false;
  };

  const lock = () => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(ADMIN_ACCESS_KEY, 'false');
    setAuthenticated(false);
  };

  const setAdminPassword = (password: string) => {
    if (typeof window === 'undefined') return;
    const normalized = password.trim();
    if (!normalized) return;
    window.localStorage.setItem(ADMIN_PASSWORD_KEY, normalized);
  };

  return {
    authenticated,
    unlock,
    lock,
    setAdminPassword,
    defaultPassword: DEFAULT_PASSWORD,
  };
}
