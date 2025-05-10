'use client';

import DockGrid from '@/components/DockGrid';

export default function DockPage() {
  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">
        Dock Management
      </h1>
      <DockGrid />
    </div>
  );
}