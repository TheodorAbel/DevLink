'use client';

import React from 'react';
import { JobList } from './JobList';

// Simple test component to verify job features work
export function TestJobFeatures() {
  const handleJobSelect = (jobId: string) => {
    console.log('Job selected:', jobId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <JobList onJobSelect={handleJobSelect} />
    </div>
  );
}
