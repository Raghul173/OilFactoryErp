import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const DEFAULT_PRESET_ACCOUNTS = [
  {
    email: 'raghuluma2006@gmail.com',
    username: 'Raghul',
    password: 'Raghul@2006',
    name: 'Raghul (Administrator)',
    role: 'Administrator',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    department: 'System Architecture & Operations',
    status: 'Active'
  },
  {
    email: 'manager@smartoil.com',
    username: 'Manager',
    password: 'Manager@2006',
    name: 'Ananya Sharma (Manager)',
    role: 'Factory Manager',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    department: 'Plant Operations Management',
    status: 'Active'
  },
  {
    email: 'staff@smartoil.com',
    username: 'Rajesh',
    password: 'Staff@2006',
    name: 'Rajesh Kumar (Staff)',
    role: 'Factory Staff',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    department: 'Refining & Pressing',
    status: 'Active'
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('smartoil_user');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.email === 'raghuluma2006@gmail.com' || parsed.username?.toLowerCase() === 'raghul') {
        parsed.role = 'Administrator';
      }
      return parsed;
    }
    return null;
  });

  const [jwtToken, setJwtToken] = useState(() => {
    return localStorage.getItem('smartoil_jwt') || null;
  });

  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Allowed accounts pool (preset + backend synced)
  const [accountsPool, setAccountsPool] = useState(() => {
    const savedPool = localStorage.getItem('smartoil_accounts_pool');
    let pool = savedPool ? JSON.parse(savedPool) : DEFAULT_PRESET_ACCOUNTS;
    return pool;
  });

  // Sync with Backend on mount
  useEffect(() => {
    const syncWithBackend = async () => {
      try {
        const res = await authService.getAccountsPool();
        if (res.data?.accounts && res.data.accounts.length > 0) {
          setAccountsPool(res.data.accounts);
          localStorage.setItem('smartoil_accounts_pool', JSON.stringify(res.data.accounts));
          setIsBackendConnected(true);
        }
      } catch (err) {
        // Backend offline or starting up - continue in local mode
        setIsBackendConnected(false);
      }
    };

    syncWithBackend();
  }, []);

  const generateJWT = (userData) => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      sub: userData.email,
      name: userData.name,
      role: userData.role,
      iss: 'OilSync-Enterprise-Cloud',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 86400
    }));
    const signature = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...sig_' + Math.random().toString(36).substring(7);
    return `${header}.${payload}.${signature}`;
  };

  // Action: Update User Profile Details
  const updateUserProfile = async (updatedDetails) => {
    try {
      if (isBackendConnected) {
        await authService.updateProfile(updatedDetails);
      }
    } catch (e) {
      console.warn('Backend update failed, updating local state:', e.message);
    }

    setUser(prev => {
      const newProfile = { ...prev, ...updatedDetails };
      localStorage.setItem('smartoil_user', JSON.stringify(newProfile));
      return newProfile;
    });

    setAccountsPool(prev => {
      const updated = prev.map(acc => {
        if (acc.email === user?.email || acc.username === user?.username) {
          return { ...acc, ...updatedDetails };
        }
        return acc;
      });
      localStorage.setItem('smartoil_accounts_pool', JSON.stringify(updated));
      return updated;
    });
  };

  // Add new login credentials issued by Administrator
  const registerNewCredentials = async (newAccount) => {
    let fullAccount = {
      ...newAccount,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${newAccount.email}`,
      status: 'Active'
    };

    try {
      if (isBackendConnected) {
        const res = await authService.registerCredentials(newAccount);
        if (res.data?.user) {
          fullAccount = res.data.user;
        }
      }
    } catch (e) {
      console.warn('Backend register failed, updating local state:', e.message);
    }

    setAccountsPool(prev => {
      const updated = [fullAccount, ...prev];
      localStorage.setItem('smartoil_accounts_pool', JSON.stringify(updated));
      return updated;
    });

    return fullAccount;
  };

  const loginWithGmail = async (identifier, password = '') => {
    const trimmedId = identifier.trim().toLowerCase();

    // 1. Try Backend Authentication
    try {
      const res = await authService.login(trimmedId, password);
      if (res.data?.token && res.data?.user) {
        const { token, user: backendUser } = res.data;
        setUser(backendUser);
        setJwtToken(token);
        setIsBackendConnected(true);
        localStorage.setItem('smartoil_user', JSON.stringify(backendUser));
        localStorage.setItem('smartoil_jwt', token);
        return backendUser;
      }
    } catch (backendError) {
      console.warn('Backend login fallback to local simulation:', backendError.message);
    }

    // 2. Fallback to local authentication if backend is unreachable
    let accountData;
    if (trimmedId === 'raghuluma2006@gmail.com' || trimmedId === 'raghul') {
      accountData = {
        email: 'raghuluma2006@gmail.com',
        username: 'Raghul',
        password: 'Raghul@2006',
        name: 'Raghul (Administrator)',
        role: 'Administrator',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        department: 'System Architecture & Operations',
        status: 'Active'
      };
    } else {
      let matched = accountsPool.find(
        a => a.email.toLowerCase() === trimmedId || a.username?.toLowerCase() === trimmedId
      );

      if (matched) {
        accountData = matched;
      } else {
        const nameFromEmail = identifier.split('@')[0].replace('.', ' ');
        accountData = {
          email: identifier.includes('@') ? identifier : `${identifier}@gmail.com`,
          username: identifier.split('@')[0],
          name: nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1),
          role: 'Factory Staff',
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${identifier}`,
          department: 'General Operations',
          status: 'Active'
        };
      }
    }

    const token = generateJWT(accountData);
    const fullUser = { ...accountData, loginTime: new Date().toISOString() };

    setUser(fullUser);
    setJwtToken(token);
    localStorage.setItem('smartoil_user', JSON.stringify(fullUser));
    localStorage.setItem('smartoil_jwt', token);
    return fullUser;
  };

  const logout = () => {
    setUser(null);
    setJwtToken(null);
    localStorage.removeItem('smartoil_user');
    localStorage.removeItem('smartoil_jwt');
  };

  const hasAccess = (allowedRoles) => {
    if (!user) return false;
    if (user.role === 'Administrator') return true;
    return allowedRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{
      user,
      jwtToken,
      isAuthenticated: !!user,
      isBackendConnected,
      loginWithGmail,
      registerNewCredentials,
      updateUserProfile,
      logout,
      hasAccess,
      accountsPool
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
