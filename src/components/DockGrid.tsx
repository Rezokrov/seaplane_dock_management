'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import OffBaseAircraft from '@/components/OffBaseAircraft';

type DockStatus = 'Free' | 'Occupied' | 'Unserviceable';

interface Aircraft {
  id: string;
  tail_number: string;
  status: 'Active' | 'Inactive';
  created_at: string;
}

export default function DockGrid() {
  const [aircraft, setAircraft] = useState<Aircraft[]>([]);
  const [docks, setDocks] = useState([
    { id: 1, position: '1-1', status: 'Occupied' as DockStatus, tail: "8Q-LET" },
    { id: 2, position: '1-3', status: 'Free' as DockStatus, tail: undefined },
    { id: 3, position: '1-5', status: 'Free' as DockStatus, tail: undefined },
    { id: 4, position: '1-7', status: 'Free' as DockStatus, tail: undefined },
    { id: 5, position: '3-1', status: 'Unserviceable' as DockStatus, tail: undefined },
    { id: 6, position: '3-3', status: 'Free' as DockStatus, tail: undefined },
    { id: 7, position: '3-5', status: 'Free' as DockStatus, tail: undefined },
    { id: 8, position: '3-7', status: 'Unserviceable' as DockStatus, tail: undefined },
  ]);

  const [selectedDock, setSelectedDock] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<DockStatus>('Free');
  const [selectedTail, setSelectedTail] = useState<string | null>(null);
  const [readOnly, setReadOnly] = useState(false);

  useEffect(() => {
    const fetchAircraft = async () => {
      const { data } = await supabase.from('aircraft').select('*').eq('status', 'Active');
      if (data) setAircraft(data);
    };

    const checkUserRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email === 'view@test.com') setReadOnly(true);
    };

    fetchAircraft();
    checkUserRole();
  }, []);

  const assignedAircraft = docks
    .filter((d) => d.status === 'Occupied' && d.tail)
    .map((d) => d.tail!);

  const availableAircraft = aircraft.filter(
    (a) => !assignedAircraft.includes(a.tail_number)
  );

  const handleDockClick = (dockId: number) => {
    if (readOnly) return;
    setSelectedDock(dockId);
    const dock = docks.find((d) => d.id === dockId);
    if (dock) {
      setSelectedStatus(dock.status);
      setSelectedTail(dock.tail || null);
    }
  };

  const handleSaveDock = () => {
    if (selectedDock !== null) {
      setDocks((prev) =>
        prev.map((dock) =>
          dock.id === selectedDock
            ? {
                ...dock,
                status: selectedStatus,
                tail: selectedStatus === 'Occupied' ? selectedTail : undefined,
              }
            : dock
        )
      );
      setSelectedDock(null);
      setSelectedTail(null);
      setSelectedStatus('Free');
    }
  };

  const renderCell = (row: number, col: number) => {
    if ((col === 2 || col === 6) && row === 1) {
      return (
        <div
          key={`walkway-${col}`}
          className="bg-gray-300 rounded-lg flex items-center justify-center text-gray-700 row-span-4"
        >
          Walkway
        </div>
      );
    }

    if (col === 4 && row === 1) {
      return (
        <div
          key="water"
          className="bg-blue-200 rounded-lg flex items-center justify-center text-blue-700 row-span-4"
        >
          Water
        </div>
      );
    }

    if (col === 2 || col === 4 || col === 6) return null;

    const dock = docks.find((d) => d.position === `${row}-${col}`);
    if (dock) {
      const bgColor =
        dock.status === 'Occupied'
          ? 'bg-red-500'
          : dock.status === 'Free'
          ? 'bg-green-500'
          : 'bg-gray-500';

      return (
        <div
          key={`${row}-${col}`}
          onClick={() => handleDockClick(dock.id)}
          className={`${
            readOnly ? 'cursor-default' : 'cursor-pointer'
          } flex items-center justify-center rounded-lg shadow-md text-white font-bold ${bgColor}`}
        >
          {dock.status === 'Occupied' ? dock.tail : dock.status}
        </div>
      );
    }

    return <div key={`${row}-${col}`} />;
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-6xl">
      <div className="grid grid-cols-7 grid-rows-4 gap-x-4 gap-y-8 w-full auto-rows-fr">
        {Array.from({ length: 4 }, (_, rowIndex) =>
          Array.from({ length: 7 }, (_, colIndex) =>
            renderCell(rowIndex + 1, colIndex + 1)
          )
        )}
      </div>

      {/* Off-Base Aircraft Section */}
      <OffBaseAircraft assignedAircraft={assignedAircraft} />

      {/* Modal for Dock Management - Hidden for Viewer */}
      {!readOnly && (
        <Dialog
          open={selectedDock !== null}
          onOpenChange={(isOpen) => !isOpen && setSelectedDock(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Manage Dock</DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-4 mt-4">
              <div className="flex gap-2">
                {['Free', 'Occupied', 'Unserviceable'].map((status) => (
                  <Button
                    key={status}
                    variant={selectedStatus === status ? 'default' : 'outline'}
                    onClick={() => setSelectedStatus(status as DockStatus)}
                  >
                    {status}
                  </Button>
                ))}
              </div>

              {selectedStatus === 'Occupied' && (
                <select
                  value={selectedTail || ''}
                  onChange={(e) => setSelectedTail(e.target.value)}
                  className="border p-2 rounded-lg"
                >
                  <option value="">Select Aircraft</option>
                  {availableAircraft.map((a) => (
                    <option key={a.id} value={a.tail_number}>
                      {a.tail_number}
                    </option>
                  ))}
                </select>
              )}

              <Button onClick={handleSaveDock}>Save</Button>
              <Button
                variant="destructive"
                onClick={() => setSelectedDock(null)}
              >
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}