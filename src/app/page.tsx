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
    <div>
      <h1>Supabase Test</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}