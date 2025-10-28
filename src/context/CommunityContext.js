import React, { createContext, useContext, useState, useEffect } from 'react';
import CommunityService from '../services/CommunityService';
import { useUser } from './UserContext';

const CommunityContext = createContext();

export const CommunityProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  
  const { user, userProfile } = useUser();

  // Load community posts
  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get user's doctor ID if they're a patient
      const doctorId = userProfile?.userType === 'patient' ? userProfile?.doctorId : null;
      
      // Use filtered posts for patients, all posts for doctors
      const communityPosts = userProfile?.userType === 'patient' && user?.uid
        ? await CommunityService.getPostsForUser(user.uid, doctorId)
        : await CommunityService.getPosts();
      
      setPosts(communityPosts);
    } catch (error) {
      setError(error.message);
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Refresh posts
  const refreshPosts = async () => {
    try {
      setRefreshing(true);
      setError(null);
      
      // Get user's doctor ID if they're a patient
      const doctorId = userProfile?.userType === 'patient' ? userProfile?.doctorId : null;
      
      // Use filtered posts for patients, all posts for doctors
      const communityPosts = userProfile?.userType === 'patient' && user?.uid
        ? await CommunityService.getPostsForUser(user.uid, doctorId)
        : await CommunityService.getPosts();
      
      setPosts(communityPosts);
    } catch (error) {
      setError(error.message);
      console.error('Error refreshing posts:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Create a new post
  const createPost = async (postData) => {
    try {
      setError(null);
      
      const newPost = {
        ...postData,
        userId: user.uid,
        user: {
          name: userProfile?.username || userProfile?.displayName || user.displayName || 'Anonymous',
          avatar: userProfile?.profilePicture || user.photoURL || null,
          isFriend: false // This would be determined by friendship logic
        }
      };
      
      const postId = await CommunityService.createPost(newPost);
      
      // Add the new post to the beginning of the posts array
      const createdPost = {
        id: postId,
        ...newPost,
        createdAt: new Date(),
        updatedAt: new Date(),
        likes: 0,
        comments: 0,
        likedBy: [],
        commentsList: []
      };
      
      setPosts(prev => [createdPost, ...prev]);
      return postId;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Like a post
  const likePost = async (postId) => {
    try {
      setError(null);
      
      // Optimistic update
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          const isLiked = post.likedBy?.includes(user.uid);
          return {
            ...post,
            likes: isLiked ? post.likes - 1 : post.likes + 1,
            likedBy: isLiked 
              ? post.likedBy.filter(id => id !== user.uid)
              : [...(post.likedBy || []), user.uid]
          };
        }
        return post;
      }));
      
      // Update in database
      const post = posts.find(p => p.id === postId);
      const isLiked = post?.likedBy?.includes(user.uid);
      
      if (isLiked) {
        await CommunityService.unlikePost(postId, user.uid);
      } else {
        await CommunityService.likePost(postId, user.uid);
      }
    } catch (error) {
      setError(error.message);
      // Revert optimistic update on error
      await refreshPosts();
      throw error;
    }
  };

  // Add a comment to a post
  const addComment = async (postId, commentText) => {
    try {
      setError(null);
      
      const commentData = {
        userId: user.uid,
        user: {
          name: user.displayName || 'Anonymous',
          avatar: user.photoURL || null
        },
        text: commentText
      };
      
      // Optimistic update
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments + 1,
            commentsList: [...(post.commentsList || []), {
              ...commentData,
              createdAt: new Date()
            }]
          };
        }
        return post;
      }));
      
      // Update in database
      await CommunityService.addComment(postId, commentData);
    } catch (error) {
      setError(error.message);
      // Revert optimistic update on error
      await refreshPosts();
      throw error;
    }
  };

  // Delete a post
  const deletePost = async (postId) => {
    try {
      setError(null);
      
      // Optimistic update
      setPosts(prev => prev.filter(post => post.id !== postId));
      
      // Delete from database
      await CommunityService.deletePost(postId);
    } catch (error) {
      setError(error.message);
      // Revert optimistic update on error
      await refreshPosts();
      throw error;
    }
  };

  // Load posts on mount
  useEffect(() => {
    if (user) {
      loadPosts();
    }
  }, [user]);

  // Refresh posts when user profile changes (for profile picture updates)
  useEffect(() => {
    if (user && userProfile) {
      refreshPosts();
    }
  }, [userProfile?.profilePicture]);

  const value = {
    posts,
    loading,
    error,
    refreshing,
    loadPosts,
    refreshPosts,
    createPost,
    likePost,
    addComment,
    deletePost,
    setError
  };

  return (
    <CommunityContext.Provider value={value}>
      {children}
    </CommunityContext.Provider>
  );
};

export const useCommunity = () => {
  const context = useContext(CommunityContext);
  if (!context) {
    throw new Error('useCommunity must be used within a CommunityProvider');
  }
  return context;
};

export { CommunityContext };
