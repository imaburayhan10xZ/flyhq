import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // Check if admin
        try {
           const userDocRef = doc(db, 'users', user.uid);
           const userDoc = await getDoc(userDocRef);
           if (userDoc.exists()) {
               setIsAdmin(userDoc.data()?.role === 'admin' || user.email === 'aburayhan10x@gmail.com');
           } else {
               // First time login - create standard user profile
               await setDoc(userDocRef, {
                   email: user.email,
                   role: user.email === 'aburayhan10x@gmail.com' ? 'admin' : 'user', // default role
                   createdAt: serverTimestamp()
               });
               setIsAdmin(user.email === 'aburayhan10x@gmail.com');
           }
        } catch (e) {
           console.error("Error fetching user profile", e);
           setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, signInWithGoogle, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
