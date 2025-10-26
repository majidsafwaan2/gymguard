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
        // Fetch user profile from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const profileData = userDoc.data();
            console.log('Fetched user profile:', profileData);
            setUserProfile(profileData);
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
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        setUserProfile(userDoc.data());
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
      
      // Update local state
      setUserProfile(prev => ({ ...prev, ...updates }));
      
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
