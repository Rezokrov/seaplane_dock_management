'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function DashboardPage() {
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        router.push('/login');
        return;
      }

      const email = user.email || '';
      setUserEmail(email);
      setLoading(false);
    };

    loadUser();
  }, [router]);

  const getUserRole = () => {
    if (userEmail === 'occ@test.com') return 'OCC';
    if (userEmail === 'view@test.com') return 'Viewer';
    return 'User';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-6">
        <p className="text-gray-800 dark:text-gray-200 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-6">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md text-black dark:text-white text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome, {getUserRole()} 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Logged in as: <strong>{userEmail}</strong>
        </p>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          We are glad to have you on board.
        </p>
        <img
          src="https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?auto=format&fit=crop&w=300&q=80"
          alt="Welcome"
          className="mx-auto mt-6 w-48 h-48 object-cover rounded-full shadow-md"
        />
      </div>
    </div>
  );
}