import { db } from './firebase';
import { ref, push, set, update, remove, get, query, orderByChild, equalTo } from 'firebase/database';

class FirebaseService {
  // Generic function to add data
  async add(collection, data, userId) {
    try {
      const collectionRef = ref(db, collection);
      const newRef = push(collectionRef);
      const newData = {
        ...data,
        id: newRef.key,
        userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await set(newRef, newData);
      return newData;
    } catch (error) {
      console.error(`Error adding to ${collection}:`, error);
      throw error;
    }
  }

  // Generic function to update data
  async update(collection, id, data) {
    try {
      const itemRef = ref(db, `${collection}/${id}`);
      const updateData = {
        ...data,
        updatedAt: new Date().toISOString()
      };

      await update(itemRef, updateData);
      return { id, ...updateData };
    } catch (error) {
      console.error(`Error updating ${collection}:`, error);
      throw error;
    }
  }

  // Generic function to delete data
  async delete(collection, id) {
    try {
      const itemRef = ref(db, `${collection}/${id}`);
      await remove(itemRef);
      return id;
    } catch (error) {
      console.error(`Error deleting from ${collection}:`, error);
      throw error;
    }
  }

  // Generic function to get all data for a user
  async getAll(collection, userId) {
    try {
      const collectionRef = ref(db, collection);
      const userQuery = query(
        collectionRef,
        orderByChild('userId'),
        equalTo(userId)
      );

      const snapshot = await get(userQuery);

      if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
      return [];
    } catch (error) {
      console.error(`Error getting from ${collection}:`, error);
      throw error;
    }
  }

  // Get single item by ID
  async getById(collection, id) {
    try {
      const itemRef = ref(db, `${collection}/${id}`);
      const snapshot = await get(itemRef);

      if (snapshot.exists()) {
        return { id, ...snapshot.val() };
      }
      return null;
    } catch (error) {
      console.error(`Error getting ${collection}:`, error);
      throw error;
    }
  }
}

export default new FirebaseService();