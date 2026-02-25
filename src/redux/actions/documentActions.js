import * as types from '../types';
import firebaseService from '../../services/firebaseService';
import { storageService } from '../../services/storageService';
import { toast } from 'react-toastify';

export const getDocuments = (userId) => async (dispatch) => {
  try {
    const documents = await firebaseService.getAll('documents', userId);
    dispatch({ type: types.GET_DOCUMENTS, payload: documents });
  } catch (error) {
    console.error('Error fetching documents:', error);
    toast.error('Error fetching documents');
  }
};

export const addDocument = (documentData, userId, files) => async (dispatch) => {
  try {
    let documentWithUrls = { ...documentData };
    
    // Upload files if any
    if (files) {
      if (files.pancard) {
        try {
          const panUrl = await storageService.uploadFile(
            files.pancard, 
            `documents/${userId}/pancard_${Date.now()}_${files.pancard.name}`
          );
          documentWithUrls.pancardUrl = panUrl;
        } catch (uploadError) {
          console.error('PAN card upload failed:', uploadError);
          toast.error('PAN card upload failed, but document will be saved');
        }
      }
      
      if (files.aadhar) {
        try {
          const aadharUrl = await storageService.uploadFile(
            files.aadhar, 
            `documents/${userId}/aadhar_${Date.now()}_${files.aadhar.name}`
          );
          documentWithUrls.aadharUrl = aadharUrl;
        } catch (uploadError) {
          console.error('Aadhar card upload failed:', uploadError);
          toast.error('Aadhar card upload failed, but document will be saved');
        }
      }
    }

    const newDocument = await firebaseService.add('documents', documentWithUrls, userId);
    dispatch({ type: types.ADD_DOCUMENT, payload: newDocument });
    toast.success('Document added successfully');
    return newDocument;
  } catch (error) {
    console.error('Error adding document:', error);
    toast.error('Error adding document: ' + error.message);
  }
};

export const updateDocument = (id, documentData, files) => async (dispatch) => {
  try {
    let documentWithUrls = { ...documentData };
    
    // Upload new files if any
    if (files) {
      if (files.pancard) {
        try {
          const panUrl = await storageService.uploadFile(
            files.pancard, 
            `documents/${id}/pancard_${Date.now()}_${files.pancard.name}`
          );
          documentWithUrls.pancardUrl = panUrl;
        } catch (uploadError) {
          console.error('PAN card upload failed:', uploadError);
          toast.error('PAN card upload failed');
        }
      }
      
      if (files.aadhar) {
        try {
          const aadharUrl = await storageService.uploadFile(
            files.aadhar, 
            `documents/${id}/aadhar_${Date.now()}_${files.aadhar.name}`
          );
          documentWithUrls.aadharUrl = aadharUrl;
        } catch (uploadError) {
          console.error('Aadhar card upload failed:', uploadError);
          toast.error('Aadhar card upload failed');
        }
      }
    }

    const updatedDocument = await firebaseService.update('documents', id, documentWithUrls);
    dispatch({ type: types.UPDATE_DOCUMENT, payload: updatedDocument });
    toast.success('Document updated successfully');
  } catch (error) {
    console.error('Error updating document:', error);
    toast.error('Error updating document: ' + error.message);
  }
};

export const deleteDocument = (id) => async (dispatch) => {
  try {
    await firebaseService.delete('documents', id);
    dispatch({ type: types.DELETE_DOCUMENT, payload: id });
    toast.success('Document deleted successfully');
  } catch (error) {
    console.error('Error deleting document:', error);
    toast.error('Error deleting document: ' + error.message);
  }
};