'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type Job = {
  id: number;
  title: string;
  description: string;
  // Add other fields from your table
};

export default function TestPage() {
  const [data, setData] = useState<Job[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('jobs').select('*')
      console.log('Data:', data)
      console.log('Error:', error)
      if (data) setData(data as Job[]) // 👈 cast safely
    }

    fetchData()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Job Marketplace Dashboard</h1>
      
      {/* Quick Navigation */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">Quick Access</h2>
        <div className="flex gap-4">
          <a href="/notifications" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            🔔 Notifications Dashboard
          </a>
          <a href="/saved-jobs" className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            📋 Saved Jobs
          </a>
        </div>
      </div>
      
      <h3 className="text-lg font-semibold mb-2">Supabase Test Data</h3>
      <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}