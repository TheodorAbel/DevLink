'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Job } from '@/components/JobCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bookmark, Heart, Search, Filter, ArrowLeft, Trash2, Eye } from 'lucide-react';
import { useSavedJobsList, useSaveJobMutation, getMockSaved, setMockSaved as setMockSavedLocal } from '@/hooks/useSavedJobs';

export default function SavedJobsPage() {
  const { data: dbSaved = [], isLoading, error } = useSavedJobsList();
  const saveMutation = useSaveJobMutation();
  const [searchQuery, setSearchQuery] = useState('');
  const [savedDbIds, setSavedDbIds] = useState<Set<string>>(new Set());
  const [mockSaved, setMockSaved] = useState<Job[]>(getMockSaved());
  const savedJobs: Job[] = useMemo(() => {
    const byId = new Map<string, Job>();
    for (const j of dbSaved) byId.set(j.id, j);
    for (const j of mockSaved) if (!byId.has(j.id)) byId.set(j.id, j);
    return Array.from(byId.values());
  }, [dbSaved, mockSaved]);

  // Track DB ids so we know which to delete via API
  useEffect(() => {
    setSavedDbIds(new Set((dbSaved || []).map(j => j.id)));
  }, [dbSaved]);

  const handleRemoveJob = async (jobId: string) => {
    try {
      if (savedDbIds.has(jobId)) {
        await saveMutation.mutateAsync({ jobId, remove: true });
        setSavedDbIds(prev => { const n = new Set(prev); n.delete(jobId); return n; });
      } else {
        // Remove from local storage mocks
        const arr = getMockSaved().filter(j => j.id !== jobId);
        setMockSaved(arr);
        setMockSavedLocal(arr);
      }
    } catch {
      // ignore
    }
  };

  const handleViewJob = (jobId: string) => {
    window.location.href = `/jobs/${jobId}`;
  };

  const filteredJobs = savedJobs.filter(job =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-4 w-4" />
                Back to Jobs
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Bookmark className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Saved Jobs</h1>
                  <p className="text-gray-600">{savedJobs.length} jobs saved</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="p-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search saved jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Saved Jobs Grid */}
        {isLoading && (
          <Card className="p-6 mb-6"><CardContent>Loading saved jobs…</CardContent></Card>
        )}
        {error && (
          <Card className="p-6 mb-6"><CardContent className="text-red-600">{String(error)}</CardContent></Card>
        )}
        {filteredJobs.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {filteredJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
                          {job.title}
                        </h3>
                        <p className="text-blue-600 font-medium">{job.company}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <span>{job.location}</span>
                          <span>{job.salary}</span>
                          <span>{job.type}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveJob(job.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {job.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="secondary">{job.type}</Badge>
                      {job.skills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {job.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{job.skills.length - 3} more
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        Saved • Posted {job.postedDate}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewJob(job.id)}
                          className="flex items-center gap-1"
                        >
                          <Eye className="h-3 w-3" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                        >
                          Apply Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              {searchQuery ? 'No matching saved jobs' : 'No saved jobs yet'}
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchQuery 
                ? 'Try adjusting your search terms to find the jobs you saved.'
                : 'Start saving jobs you\'re interested in to keep track of opportunities that catch your eye.'
              }
            </p>
            <Link href="/">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                Browse Jobs
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
