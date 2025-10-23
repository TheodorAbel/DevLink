import { useEffect, useState } from 'react';

export interface JobPostingDefaults {
  salaryType: 'range' | 'fixed' | 'custom';
  remoteWork: boolean;
  customSalaryMessage: string;
}

const STORAGE_KEY = 'job_posting_defaults';

const defaultValues: JobPostingDefaults = {
  salaryType: 'range',
  remoteWork: false,
  customSalaryMessage: 'Competitive salary based on experience'
};

export function useJobPostingDefaults() {
  const [defaults, setDefaults] = useState<JobPostingDefaults>(defaultValues);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setDefaults({ ...defaultValues, ...parsed });
      }
    } catch (error) {
      console.error('Failed to load job posting defaults:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage whenever defaults change
  const saveDefaults = (newDefaults: Partial<JobPostingDefaults>) => {
    const updated = { ...defaults, ...newDefaults };
    setDefaults(updated);
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save job posting defaults:', error);
    }
  };

  return {
    defaults,
    saveDefaults,
    isLoaded
  };
}
