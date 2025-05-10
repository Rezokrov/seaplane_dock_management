'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface OffBaseAircraftProps {
  assignedAircraft: string[]; // List of tail_numbers currently assigned to docks
}

interface Aircraft {
  id: string;
  tail_number: string;
  status: 'Active' | 'Inactive';
  created_at: string;
}

export default function OffBaseAircraft({ assignedAircraft }: OffBaseAircraftProps) {
  const [aircraft, setAircraft] = useState<Aircraft[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAircraft = async () => {
      const { data, error } = await supabase
        .from('aircraft')
        .select('*')
        .eq('status', 'Active');

      if (!error && data) {
        setAircraft(data);
      }
      setLoading(false);
    };

    fetchAircraft();
  }, []);

  const offBaseAircraft = aircraft.filter(
    (a) => !assignedAircraft.includes(a.tail_number)
  );

  return (
    <div className="mt-10 w-full">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Off-Base Aircraft
      </h2>
      {loading ? (
        <p className="text-gray-600 dark:text-gray-300">Loading aircraft...</p>
      ) : (
        <div className="flex flex-wrap gap-4">
          {offBaseAircraft.length > 0 ? (
            offBaseAircraft.map((a) => (
              <div
                key={a.id}
                className="bg-black text-white px-4 py-2 rounded shadow"
              >
                {a.tail_number}
              </div>
            ))
          ) : (
            <p className="text-gray-600 dark:text-gray-300">
              All active aircraft are assigned to docks.
            </p>
          )}
        </div>
      )}
    </div>
  );
}