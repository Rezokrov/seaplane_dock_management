'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function DashboardPage() {
  const [userEmail, setUserEmail] = useState('')
  const [role, setRole] = useState<'OCC' | 'Viewer' | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error || !user) {
        router.push('/login')
        return
      }

      const email = user.email || ''
      const roleMap: Record<string, 'OCC' | 'Viewer'> = {
        'occ@test.com': 'OCC',
        'view@test.com': 'Viewer',
      }

      setUserEmail(email)
      setRole(roleMap[email] || 'Viewer') // fallback to Viewer
      setLoading(false)
    }

    loadUser()
  }, [router])

  if (loading) return <p className="p-4">Loading...</p>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-4">Welcome, <strong>{userEmail}</strong> 👋</p>
      <p className="text-gray-600">Role: {role}</p>

      <div className="mt-6 space-y-2">
        <a href="/docks" className="underline text-blue-600">Go to Docks</a>
        {role === 'OCC' && (
          <>
            <a href="/fleet" className="underline text-blue-600 block">Fleet Management</a>
            <a href="/reports" className="underline text-blue-600 block">Reports</a>
          </>
        )}
      </div>
    </div>
  )
}