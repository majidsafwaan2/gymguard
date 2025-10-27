import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  limit, 
  where,
  increment,
  arrayUnion,
  arrayRemove,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

class CommunityService {
  // Create a new community post
  static async createPost(postData) {
    try {
      const postsRef = collection(db, 'communityPosts');
      const docRef = await addDoc(postsRef, {
        ...postData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        likes: 0,
        comments: 0,
        likedBy: [],
        commentsList: []
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }

  // Get all community posts (paginated)
  static async getPosts(limitCount = 20) {
    try {
      const postsRef = collection(db, 'communityPosts');
      const q = query(
        postsRef, 
        orderBy('createdAt', 'desc'), 
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      const posts = [];
      
      querySnapshot.forEach((doc) => {
        posts.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate?.() || new Date()
        });
      });
      
      return posts;
    } catch (error) {
      console.error('Error getting posts:', error);
      throw error;
    }
  }

  // Get posts by a specific user
  static async getUserPosts(userId) {
    try {
      const postsRef = collection(db, 'communityPosts');
      const q = query(
        postsRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const posts = [];
      
      querySnapshot.forEach((doc) => {
        posts.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate?.() || new Date()
        });
      });
      
      return posts;
    } catch (error) {
      console.error('Error getting user posts:', error);
      throw error;
    }
  }

  // Like a post
  static async likePost(postId, userId) {
    try {
      const postRef = doc(db, 'communityPosts', postId);
      await updateDoc(postRef, {
        likes: increment(1),
        likedBy: arrayUnion(userId),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error liking post:', error);
      throw error;
    }
  }

  // Unlike a post
  static async unlikePost(postId, userId) {
    try {
      const postRef = doc(db, 'communityPosts', postId);
      await updateDoc(postRef, {
        likes: increment(-1),
        likedBy: arrayRemove(userId),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error unliking post:', error);
      throw error;
    }
  }

  // Add a comment to a post
  static async addComment(postId, commentData) {
    try {
      const postRef = doc(db, 'communityPosts', postId);
      await updateDoc(postRef, {
        comments: increment(1),
        commentsList: arrayUnion({
          ...commentData,
          createdAt: serverTimestamp()
        }),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }

  // Update a post
  static async updatePost(postId, updateData) {
    try {
      const postRef = doc(db, 'communityPosts', postId);
      await updateDoc(postRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  }

  // Delete a post
  static async deletePost(postId) {
    try {
      const postRef = doc(db, 'communityPosts', postId);
      await deleteDoc(postRef);
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }

  // Get user profile data
  static async getUserProfile(userId) {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return {
          id: userSnap.id,
          ...userSnap.data()
        };
      } else {
        throw new Error('User profile not found');
      }
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  // Update user profile
  static async updateUserProfile(userId, updateData) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }
}

export default CommunityService;
