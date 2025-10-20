import { useEffect, useState } from 'react';

export function useDraftStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setValue(JSON.parse(item));
      }
    } catch (error) {
      console.error('Error loading draft from localStorage:', error);
    } finally {
      setIsLoaded(true);
    }
  }, [key]);

  // Save to localStorage whenever value changes
  useEffect(() => {
    if (!isLoaded) return; // Don't save on initial load
    
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving draft to localStorage:', error);
    }
  }, [key, value, isLoaded]);

  const clearDraft = () => {
    try {
      window.localStorage.removeItem(key);
      setValue(initialValue);
    } catch (error) {
      console.error('Error clearing draft from localStorage:', error);
    }
  };

  return { value, setValue, clearDraft, isLoaded };
}
