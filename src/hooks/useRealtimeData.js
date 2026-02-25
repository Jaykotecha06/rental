import { useState, useEffect } from 'react';
import { realtimeService } from '../services/realtimeService';

export const useRealtimeData = (collection, userId) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    
    // Set up real-time listener
    const unsubscribe = realtimeService.listenToUserCollection(
      collection,
      userId,
      (items) => {
        setData(items);
        setLoading(false);
      }
    );

    // Cleanup listener on unmount
    return () => {
      unsubscribe();
    };
  }, [collection, userId]);

  return { data, loading, error };
};

export const useRealtimeItem = (collection, id) => {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    
    // Set up real-time listener for single item
    const unsubscribe = realtimeService.listenToItem(
      collection,
      id,
      (data) => {
        setItem(data);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [collection, id]);

  return { item, loading, error };
};