'use client';

import DockGrid from '@/components/DockGrid';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function DockPage() {
  const [isViewer, setIsViewer] = useState(false);

  useEffect(() => {
    const checkUserRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email === 'view@test.com') setIsViewer(true);
    };
    checkUserRole();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
        Dock Management
      </h1>
      <DockGrid readOnly={isViewer} />
    </div>
  );
}