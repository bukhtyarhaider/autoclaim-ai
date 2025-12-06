import { UserProfile, SavedReport, Currency } from "../types";

const USERS_KEY = 'autoclaim_users';
const REPORTS_KEY = 'autoclaim_reports';
const CURRENT_USER_KEY = 'autoclaim_current_user';

// Mock Auth
export const authService = {
  login: (email: string, password: string): UserProfile | null => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);
    if (user) {
      const { password, ...profile } = user;
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(profile));
      return profile;
    }
    return null;
  },

  register: (name: string, email: string, password: string): UserProfile | string => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    if (users.find((u: any) => u.email === email)) {
      return "Email already exists";
    }

    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      password,
      currency: 'PKR' as Currency, // Default
      credits: 5,
      hasCompletedOnboarding: false,
      joinedAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    const { password: _, ...profile } = newUser;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(profile));
    return profile;
  },

  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  getCurrentUser: (): UserProfile | null => {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  updateProfile: (updatedProfile: UserProfile): void => {
    // Update current session
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedProfile));

    // Update database
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const index = users.findIndex((u: any) => u.id === updatedProfile.id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updatedProfile };
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
  },

  deductCredit: (userId: string): boolean => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const index = users.findIndex((u: any) => u.id === userId);
    
    if (index !== -1 && users[index].credits > 0) {
      users[index].credits -= 1;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      
      // Update current session if it matches
      const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || '{}');
      if (currentUser.id === userId) {
        currentUser.credits = users[index].credits;
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
      }
      return true;
    }
    return false;
  },

  completeOnboarding: (userId: string): void => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const index = users.findIndex((u: any) => u.id === userId);
    
    if (index !== -1) {
      users[index].hasCompletedOnboarding = true;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      
      // Update current session if it matches
      const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || '{}');
      if (currentUser.id === userId) {
        currentUser.hasCompletedOnboarding = true;
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
      }
    }
  }
};

// Mock Database for Reports
export const reportService = {
  saveReport: (report: SavedReport): void => {
    const reports = JSON.parse(localStorage.getItem(REPORTS_KEY) || '[]');
    reports.unshift({ ...report, id: Math.random().toString(36).substr(2, 9) });
    localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
  },

  getUserReports: (userId: string): SavedReport[] => {
    const reports = JSON.parse(localStorage.getItem(REPORTS_KEY) || '[]');
    return reports.filter((r: SavedReport) => r.userId === userId);
  }
};
