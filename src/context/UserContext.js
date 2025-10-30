import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signOut, 
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        // Fetch user profile from Firestore with retry logic
        try {
          let retries = 0;
          const maxRetries = 5;
          let userDoc = null;
          
          // Retry fetching the profile if it doesn't exist yet (handles race condition during signup)
          while (retries < maxRetries) {
            userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
              break;
            }
            console.log(`Profile not found yet, retrying... (${retries + 1}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
            retries++;
          }
          
          if (userDoc && userDoc.exists()) {
            const profileData = {
              ...userDoc.data(),
              uid: user.uid // Ensure UID is always included and matches Firebase Auth UID
            };
            console.log('Fetched user profile with UID:', profileData);
            setUserProfile(profileData);
          } else {
            console.error('User profile not found after retries');
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Function to refresh user profile from Firestore
  const refreshUserProfile = async () => {
    if (!user || !user.uid) return;
    try {
      console.log('Refreshing user profile for:', user.uid);
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const profileData = {
          ...userDoc.data(),
          uid: user.uid // Ensure UID is always included and matches Firebase Auth UID
        };
        console.log('Refreshed user profile with UID:', profileData);
        setUserProfile(profileData);
      } else {
        console.warn('User profile document does not exist');
      }
    } catch (error) {
      console.error('Error refreshing user profile:', error);
    }
  };

  // Sign out function
  const signOutUser = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (updates) => {
    try {
      if (!user || !user.uid) {
        console.error('Update profile error: User is not authenticated');
        throw new Error('User is not authenticated');
      }
      
      console.log('Updating user profile:', updates);
      
      // Update Firestore document
      await setDoc(doc(db, 'users', user.uid), updates, { merge: true });
      
      console.log('Profile updated successfully');
      
      // Update local state, ensuring UID is preserved
      setUserProfile(prev => ({ ...prev, ...updates, uid: user.uid }));
      
    } catch (error) {
      console.error('Update profile error:', error.message || error);
      throw error;
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    signOut: signOutUser,
    updateUserProfile,
    refreshUserProfile,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export { UserContext };
