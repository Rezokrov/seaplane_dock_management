'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function DockGrid() {
  const [docks, setDocks] = useState([
    { id: 1, position: '1-1', status: 'Free' },
    { id: 2, position: '1-3', status: 'Occupied', tail: 'M8-AAA' },
    { id: 3, position: '1-5', status: 'Free' },
    { id: 4, position: '1-7', status: 'Occupied', tail: 'M8-BBB' },
    { id: 5, position: '3-1', status: 'Free' },
    { id: 6, position: '3-3', status: 'Occupied', tail: 'M8-CCC' },
    { id: 7, position: '3-5', status: 'Free' },
    { id: 8, position: '3-7', status: 'Occupied', tail: 'M8-DDD' },
  ]);

  const [selectedDock, setSelectedDock] = useState<number | null>(null);

  const handleAssignAircraft = (tailNumber: string) => {
    if (selectedDock !== null) {
      setDocks((prevDocks) =>
        prevDocks.map((dock) =>
          dock.id === selectedDock
            ? { ...dock, status: 'Occupied', tail: tailNumber }
            : dock
        )
      );
      setSelectedDock(null);
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
      return (
        <div
          key={`${row}-${col}`}
          onClick={() => setSelectedDock(dock.id)}
          className={`cursor-pointer flex items-center justify-center rounded-lg shadow-md text-white font-bold ${
            dock.status === 'Occupied' ? 'bg-red-500' : 'bg-green-500'
          }`}
        >
          {dock.status === 'Occupied' ? dock.tail : 'Free'}
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
      <div className="mt-10 w-full">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Off-Base Aircraft
        </h2>
        <div className="flex flex-wrap gap-4">
          <div className="bg-yellow-400 text-white px-4 py-2 rounded shadow">
            M8-EEE
          </div>
          <div className="bg-yellow-400 text-white px-4 py-2 rounded shadow">
            M8-FFF
          </div>
        </div>
      </div>

      {/* Modal for Assigning Aircraft */}
      <Dialog open={selectedDock !== null} onOpenChange={(isOpen) => !isOpen && setSelectedDock(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Aircraft</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-4">
            <Button onClick={() => handleAssignAircraft('M8-EEE')}>Assign M8-EEE</Button>
            <Button onClick={() => handleAssignAircraft('M8-FFF')}>Assign M8-FFF</Button>
            <Button variant="destructive" onClick={() => setSelectedDock(null)}>Cancel</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}