import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile as updateFirebaseProfile,
  signInWithPopup
} from "firebase/auth";
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  orderBy,
  runTransaction
} from "firebase/firestore";
import { auth, db, googleProvider } from "./firebase";
import { UserProfile, SavedReport, Currency } from "../types";

const USERS_COLLECTION = 'users';
const REPORTS_COLLECTION = 'reports';

export const authService = {
  loginWithGoogle: async (): Promise<UserProfile | null> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user exists
      const userDoc = await getDoc(doc(db, USERS_COLLECTION, user.uid));
      if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
      }

      // If new user, create profile
      const newUser: UserProfile = {
        id: user.uid,
        name: user.displayName || 'User',
        email: user.email || '',
        currency: 'PKR' as Currency,
        credits: 5,
        hasCompletedOnboarding: false,
      };

      await setDoc(doc(db, USERS_COLLECTION, user.uid), newUser);
      return newUser;
    } catch (error) {
      console.error("Google login error:", error);
      return null;
    }
  },

  login: async (email: string, password: string): Promise<UserProfile | null> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Get user profile from Firestore
      const userDoc = await getDoc(doc(db, USERS_COLLECTION, user.uid));
      if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
      }
      return null;
    } catch (error) {
      console.error("Login error:", error);
      return null;
    }
  },

  register: async (name: string, email: string, password: string): Promise<UserProfile | string> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update display name
      await updateFirebaseProfile(user, { displayName: name });

      const newUser: UserProfile = {
        id: user.uid,
        name,
        email,
        currency: 'PKR' as Currency,
        credits: 5,
        hasCompletedOnboarding: false,
        // joinedAt: new Date().toISOString() // Not in original interface but good to have in DB
      };

      // Create user document
      await setDoc(doc(db, USERS_COLLECTION, user.uid), newUser);
      
      return newUser;
    } catch (error: any) {
      console.error("Registration error:", error);
      // Map firebase errors to user friendly messages if needed
      if (error.code === 'auth/email-already-in-use') {
        return "Email already exists";
      }
      return error.message || "Registration failed";
    }
  },

  logout: async () => {
    await signOut(auth);
  },

  // This is now async or should be replaced by onAuthStateChanged in the Context
  // We keep it for simple checks if needed, but it checks Firestore
  getUserProfile: async (uid: string): Promise<UserProfile | null> => {
    try {
      const userDoc = await getDoc(doc(db, USERS_COLLECTION, uid));
      if (userDoc.exists()) {
        return userDoc.data() as UserProfile;
      }
      return null;
    } catch (error) {
      console.error("Get profile error:", error);
      return null;
    }
  },

  updateProfile: async (updatedProfile: UserProfile): Promise<void> => {
    try {
      const userRef = doc(db, USERS_COLLECTION, updatedProfile.id);
      await updateDoc(userRef, { ...updatedProfile });
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  },

  deductCredit: async (userId: string): Promise<boolean> => {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);
      
      return await runTransaction(db, async (transaction) => {
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists()) {
          throw "User does not exist!";
        }

        const userData = userDoc.data() as UserProfile;
        if (userData.credits > 0) {
          transaction.update(userRef, { credits: userData.credits - 1 });
          return true;
        } else {
          return false;
        }
      });
    } catch (error) {
      console.error("Deduct credit error:", error);
      return false;
    }
  },

  completeOnboarding: async (userId: string): Promise<void> => {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);
      await updateDoc(userRef, { hasCompletedOnboarding: true });
    } catch (error) {
      console.error("Complete onboarding error:", error);
    }
  }
};

export const reportService = {
  saveReport: async (report: SavedReport): Promise<string> => {
    try {
      // Create a new document reference with an auto-generated ID if not provided, 
      // or use setDoc if we want to enforce ID. 
      // The mock used 'unshift', implying list. Here we insert into collection.
      const docData = { ...report, timestamp: new Date().toISOString() };
      const docRef = await addDoc(collection(db, REPORTS_COLLECTION), docData);
      return docRef.id;
    } catch (error) {
      console.error("Save report error:", error);
      throw error;
    }
  },

  getUserReports: async (userId: string): Promise<SavedReport[]> => {
    try {
      const q = query(
        collection(db, REPORTS_COLLECTION), 
        where("userId", "==", userId)
      );
      
      const querySnapshot = await getDocs(q);
      const reports: SavedReport[] = [];
      querySnapshot.forEach((doc) => {
        // Ensure Firestore ID takes precedence over any 'id' field in the data
        reports.push({ ...doc.data(), id: doc.id } as SavedReport);
      });
      
      // Sort by timestamp descending (newest first)
      reports.sort((a, b) => {
        const dateA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
        const dateB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
        
        // Handle invalid dates (NaN)
        const valA = isNaN(dateA) ? 0 : dateA;
        const valB = isNaN(dateB) ? 0 : dateB;
        
        return valB - valA;
      });
      
      return reports;
    } catch (error) {
      console.error("Get user reports error:", error);
      return [];
    }
  },

  getReportById: async (reportId: string): Promise<SavedReport | null> => {
    try {
      const docRef = doc(db, REPORTS_COLLECTION, reportId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        // Ensure Firestore ID takes precedence
        return { ...data, id: docSnap.id } as SavedReport;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Get report error:", error);
      return null;
    }
  }
};
