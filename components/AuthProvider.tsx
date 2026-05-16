import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

interface UserProfile {
    role: 'super_admin' | 'manager' | 'moderator' | 'admin' | 'user';
    permissions?: string[];
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  role: string | null;
  permissions: string[];
  loading: boolean;
  innerAuthError: string | null;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [innerAuthError, setInnerAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // Check if admin
        try {
           const userDocRef = doc(db, 'users', user.uid);
           let userDoc;
           try {
               userDoc = await getDoc(userDocRef);
           } catch (getErr: any) {
               console.error("Error with getDoc:", getErr);
               throw getErr;
           }
           
           let userRole = 'user';
           let userPerms: string[] = [];
           
           if (userDoc && userDoc.exists()) {
               const data = userDoc.data() as UserProfile;
               userRole = data.role || 'user';
               userPerms = data.permissions || [];
               
               // Force update to developer if they are the hardcoded master email
               if (user.email && user.email.toLowerCase() === 'aburayhan10x@gmail.com' && userRole !== 'developer') {
                   userRole = 'developer';
                   try {
                       await setDoc(userDocRef, { role: 'developer' }, { merge: true });
                   } catch (e) {
                       console.error("Failed to upgrade role to developer", e);
                   }
               }
           } else {
               // First time login - create standard user profile
               userRole = user.email && user.email.toLowerCase() === 'aburayhan10x@gmail.com' ? 'developer' : 'user';
               try {
                   await setDoc(userDocRef, {
                       email: user.email || '',
                       role: userRole,
                       createdAt: serverTimestamp()
                   });
               } catch (setErr: any) {
                   console.error("Error with setDoc:", setErr);
                   // Do not throw to allow login in memory
               }
           }
           
           setRole(userRole);
           setPermissions(userPerms);
           setIsAdmin(userRole === 'admin' || userRole === 'super_admin' || userRole === 'manager' || userRole === 'moderator' || userRole === 'developer');
           setInnerAuthError(null);
        } catch (e: any) {
           console.error("Error fetching user profile", e);
           setIsAdmin(false);
           setRole(null);
           setPermissions([]);
           setInnerAuthError(e.message || String(e));
        }
      } else {
        setIsAdmin(false);
        setRole(null);
        setPermissions([]);
        setInnerAuthError(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signInWithEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, isAdmin, role, permissions, loading, innerAuthError, signInWithGoogle, signInWithEmail, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
