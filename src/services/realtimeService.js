import { db } from './firebase';
import { 
  ref, 
  set, 
  update, 
  remove, 
  get, 
  child,
  push,
  query,
  orderByChild,
  equalTo,
  onValue,
  off 
} from 'firebase/database';

class RealtimeService {
  // Add data with auto-generated ID
  async add(collection, data, userId) {
    try {
      const collectionRef = ref(db, `${collection}`);
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
      console.error('Error adding data:', error);
      throw error;
    }
  }

  // Add data with custom ID
  async addWithId(collection, id, data, userId) {
    try {
      const itemRef = ref(db, `${collection}/${id}`);
      const newData = {
        ...data,
        id,
        userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await set(itemRef, newData);
      return newData;
    } catch (error) {
      console.error('Error adding data:', error);
      throw error;
    }
  }

  // Update data
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
      console.error('Error updating data:', error);
      throw error;
    }
  }

  // Delete data
  async delete(collection, id) {
    try {
      const itemRef = ref(db, `${collection}/${id}`);
      await remove(itemRef);
      return id;
    } catch (error) {
      console.error('Error deleting data:', error);
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
      console.error('Error getting data:', error);
      throw error;
    }
  }

  // Get all items for a user
  async getAllByUser(collection, userId) {
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
        })).sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
      }
      return [];
    } catch (error) {
      console.error('Error getting data:', error);
      throw error;
    }
  }

  // Real-time listener for all user items
  listenToUserCollection(collection, userId, callback) {
    const collectionRef = ref(db, collection);
    const userQuery = query(
      collectionRef,
      orderByChild('userId'),
      equalTo(userId)
    );
    
    const listener = onValue(userQuery, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const items = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })).sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        callback(items);
      } else {
        callback([]);
      }
    });
    
    // Return unsubscribe function
    return () => off(userQuery, 'value', listener);
  }

  // Real-time listener for single item
  listenToItem(collection, id, callback) {
    const itemRef = ref(db, `${collection}/${id}`);
    
    const listener = onValue(itemRef, (snapshot) => {
      if (snapshot.exists()) {
        callback({ id, ...snapshot.val() });
      } else {
        callback(null);
      }
    });
    
    // Return unsubscribe function
    return () => off(itemRef, 'value', listener);
  }

  // Search items by field
  async searchByField(collection, field, value) {
    try {
      const collectionRef = ref(db, collection);
      const searchQuery = query(
        collectionRef,
        orderByChild(field),
        equalTo(value)
      );
      
      const snapshot = await get(searchQuery);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
      }
      return [];
    } catch (error) {
      console.error('Error searching data:', error);
      throw error;
    }
  }

  // Get items by date range
  async getByDateRange(collection, userId, startDate, endDate) {
    try {
      const allItems = await this.getAllByUser(collection, userId);
      return allItems.filter(item => {
        const itemDate = new Date(item.createdAt);
        return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
      });
    } catch (error) {
      console.error('Error getting data by date range:', error);
      throw error;
    }
  }

  // Batch update multiple items
  async batchUpdate(collection, updates) {
    try {
      const updatesObj = {};
      
      updates.forEach(({ id, data }) => {
        updatesObj[`${collection}/${id}`] = {
          ...data,
          updatedAt: new Date().toISOString()
        };
      });
      
      await update(ref(db), updatesObj);
      return updates;
    } catch (error) {
      console.error('Error in batch update:', error);
      throw error;
    }
  }
}

export const realtimeService = new RealtimeService();