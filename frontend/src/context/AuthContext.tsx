import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'citizen' | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  area?: string;
  memberSince: string;
  // Admin-specific
  assignedZone?: string;
  employeeId?: string;
  // Saved locations
  savedLocations?: SavedLocation[];
}

export interface SavedLocation {
  id: string;
  label: 'Home' | 'College' | 'Office' | 'Other';
  address: string;
  area: string;
  landmark?: string;
  pinCode?: string;
  isDefault?: boolean;
}

// Demo accounts (hashed representation — hackathon grade)
const DEMO_USERS: AuthUser[] = [
  {
    id: 'u-001',
    name: 'Akshit Sharma',
    email: 'citizen@wastewise.demo',
    role: 'citizen',
    phone: '+91 98221 00987',
    area: 'Wakad',
    memberSince: 'September 2026',
    savedLocations: [
      { id: 'sl-1', label: 'Home', address: 'Flat 304, Green Olive Society', area: 'Wakad' },
      { id: 'sl-2', label: 'Office', address: 'Tower 2, Hinjewadi IT Park', area: 'Hinjewadi' },
    ]
  },
  {
    id: 'u-002',
    name: 'Operations Admin',
    email: 'admin@wastewise.demo',
    role: 'admin',
    phone: '+91 20 2556 7890',
    memberSince: 'January 2026',
    assignedZone: 'Pimpri-Chinchwad Municipal Zone',
    employeeId: 'PMC-OPS-2026-042',
  }
];

// Registered users stored in localStorage
const STORAGE_KEY = 'wastewise_users_v1';
const SESSION_KEY = 'wastewise_session_v1';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginAsDemo: (role: UserRole) => void;
  register: (data: RegisterPayload) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<AuthUser>) => void;
  addSavedLocation: (loc: Omit<SavedLocation, 'id'>) => void;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
  area: string;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function getRegisteredUsers(): AuthUser[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function saveRegisteredUsers(users: AuthUser[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch {}
}

// Simple hash for demo — not production grade
function simpleHash(str: string): string {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h) + str.charCodeAt(i);
    h |= 0;
  }
  return String(Math.abs(h));
}

const DEMO_PASSWORDS: Record<string, string> = {
  'citizen@wastewise.demo': simpleHash('demo123'),
  'admin@wastewise.demo': simpleHash('admin123'),
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    // Restore session
    try {
      const raw = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY + '_remember');
      if (raw) {
        const parsed = JSON.parse(raw);
        setUser(parsed);
      }
    } catch {}
  }, []);

  const saveSession = (u: AuthUser, remember = false) => {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(u));
      if (remember) {
        localStorage.setItem(SESSION_KEY + '_remember', JSON.stringify(u));
      }
    } catch {}
  };

  const clearSession = () => {
    try {
      sessionStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(SESSION_KEY + '_remember');
    } catch {}
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const normalizedEmail = email.trim().toLowerCase();

    // Check demo accounts
    const demoUser = DEMO_USERS.find(u => u.email === normalizedEmail);
    if (demoUser) {
      const expectedHash = DEMO_PASSWORDS[normalizedEmail];
      if (expectedHash && simpleHash(password) === expectedHash) {
        setUser(demoUser);
        saveSession(demoUser);
        return { success: true };
      } else {
        return { success: false, error: 'Invalid password. Try demo123 or admin123.' };
      }
    }

    // Check registered users
    const registered = getRegisteredUsers();
    const found = registered.find(u => u.email === normalizedEmail);
    if (found) {
      // In real app, compare hashed password stored at registration time
      // For hackathon: store hash alongside user
      const storedHash = (found as any).__passwordHash;
      if (storedHash && simpleHash(password) === storedHash) {
        const { __passwordHash: _, ...safeUser } = found as any;
        setUser(safeUser);
        saveSession(safeUser);
        return { success: true };
      } else {
        return { success: false, error: 'Invalid password.' };
      }
    }

    return { success: false, error: 'No account found with that email.' };
  };

  const loginAsDemo = (role: UserRole) => {
    const u = DEMO_USERS.find(u => u.role === role)!;
    setUser(u);
    saveSession(u);
  };

  const register = async (data: RegisterPayload): Promise<{ success: boolean; error?: string }> => {
    const normalizedEmail = data.email.trim().toLowerCase();

    // Check duplicates
    const allEmails = [
      ...DEMO_USERS.map(u => u.email),
      ...getRegisteredUsers().map(u => u.email)
    ];
    if (allEmails.includes(normalizedEmail)) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const newUser: AuthUser = {
      id: `u-${Date.now()}`,
      name: data.name.trim(),
      email: normalizedEmail,
      role: 'citizen',
      phone: data.phone,
      area: data.area,
      memberSince: new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
      savedLocations: [
        { id: `sl-${Date.now()}`, label: 'Home', address: 'Your home address', area: data.area }
      ]
    };

    const registered = getRegisteredUsers();
    registered.push({ ...newUser, __passwordHash: simpleHash(data.password) } as any);
    saveRegisteredUsers(registered);

    setUser(newUser);
    saveSession(newUser);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    clearSession();
  };

  const updateProfile = (updates: Partial<AuthUser>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    saveSession(updated);
    // If registered user, update store
    const registered = getRegisteredUsers();
    const idx = registered.findIndex(u => u.id === user.id);
    if (idx !== -1) {
      const withHash = (registered[idx] as any).__passwordHash;
      registered[idx] = { ...updated, __passwordHash: withHash } as any;
      saveRegisteredUsers(registered);
    }
  };

  const addSavedLocation = (loc: Omit<SavedLocation, 'id'>) => {
    if (!user) return;
    const newLoc = { ...loc, id: `sl-${Date.now()}` };
    updateProfile({ savedLocations: [...(user.savedLocations || []), newLoc] });
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, loginAsDemo, register, logout, updateProfile, addSavedLocation }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
