import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const storageService = {
  async uploadFile(file, path) {
    try {
      console.log('Uploading file to path:', path);
      
      // Create storage reference
      const storageRef = ref(storage, path);
      
      // Upload file
      const snapshot = await uploadBytes(storageRef, file);
      console.log('File uploaded successfully');
      
      // Get download URL
      const url = await getDownloadURL(snapshot.ref);
      console.log('File URL:', url);
      
      return url;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  // Optional: Delete file function
  async deleteFile(path) {
    try {
      const { ref, deleteObject } = await import('firebase/storage');
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
      console.log('File deleted successfully');
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }
};