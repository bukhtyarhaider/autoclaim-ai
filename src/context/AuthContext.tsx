import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { UserProfile } from '../types';
import { authService } from '../services/storageService';

interface AuthContextType {
  user: UserProfile | null;
  logout: () => Promise<void>;
  updateUser: (user: UserProfile) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let unsubscribeSnapshot: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      // Clean up previous snapshot listener if any
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
        unsubscribeSnapshot = null;
      }

      if (firebaseUser) {
        // User is signed in, set up real-time listener for profile
        try {
          const userRef = doc(db, 'users', firebaseUser.uid);
          unsubscribeSnapshot = onSnapshot(userRef, (docSnap) => {
            if (docSnap.exists()) {
              setUser(docSnap.data() as UserProfile);
            } else {
              // Document doesn't exist yet (registration/creation in progress)
              // We don't set user to null here immediately to avoid flickering
              // or we set it to null and let isLoading handle the "wait" state?
              // If we set it to null, isAuthenticated becomes false.
              // BUT for a new user, they are "authenticated" in Firebase but "not yet" in our system.
              // Let's keep user null until doc exists.
              console.log("User document not found (yet).");
              setUser(null);
            }
            setIsLoading(false);
          }, (error) => {
            console.error("Error listening to user profile:", error);
            setUser(null);
            setIsLoading(false);
          });
        } catch (error) {
          console.error("Error setting up snapshot listener:", error);
          setUser(null);
          setIsLoading(false);
        }
      } else {
        // User is signed out
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
      }
    };
  }, []);

  const logout = async () => {
    await authService.logout();
    // State update will happen via onAuthStateChanged
  };

  const updateUser = (userData: UserProfile) => {
    setUser(userData);
    // Optionally update Firestore too? 
    // authService.updateProfile(userData); // We might want to do this to persist changes
  };

  return (
    <AuthContext.Provider value={{ user, logout, updateUser, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
