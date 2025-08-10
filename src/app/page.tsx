'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function TestPage() {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('jobs').select('*')
      console.log('Data:', data)
      console.log('Error:', error)
      if (data) setData(data)
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