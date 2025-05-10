'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import AuthGuard from '@/components/AuthGuard';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type Aircraft = {
  id: string;
  tail_number: string;
  status: 'Active' | 'Inactive';
  created_at: string;
};

export default function FleetPage() {
  const [fleet, setFleet] = useState<Aircraft[]>([]);
  const [tailNumber, setTailNumber] = useState('');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTail, setEditTail] = useState('');
  const [editStatus, setEditStatus] = useState<'Active' | 'Inactive'>('Active');

  const fetchFleet = async () => {
    const { data, error } = await supabase
      .from('aircraft')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setFleet(data);
    }
    setLoading(false);
  };

  const addAircraft = async () => {
    if (!tailNumber) return;

    const { error } = await supabase.from('aircraft').insert([
      { tail_number: tailNumber, status },
    ]);

    if (error) {
      setErrorMsg('Could not add aircraft. Tail number may already exist.');
    } else {
      setSuccessMsg('Aircraft added successfully!');
      setTailNumber('');
      setStatus('Active');
      setErrorMsg('');
      fetchFleet();
    }
  };

  const deleteAircraft = async (id: string) => {
    const { error } = await supabase.from('aircraft').delete().eq('id', id);
    if (!error) {
      setSuccessMsg('Aircraft deleted successfully!');
      fetchFleet();
    }
  };

  const startEdit = (aircraft: Aircraft) => {
    setEditingId(aircraft.id);
    setEditTail(aircraft.tail_number);
    setEditStatus(aircraft.status);
    setSuccessMsg('');
    setErrorMsg('');
  };

  const saveEdit = async (id: string) => {
    const { error } = await supabase
      .from('aircraft')
      .update({ tail_number: editTail, status: editStatus })
      .eq('id', id);

    if (!error) {
      setSuccessMsg('Aircraft updated successfully!');
    } else {
      setErrorMsg('Failed to update aircraft.');
    }

    setEditingId(null);
    fetchFleet();
  };

  useEffect(() => {
    fetchFleet();
  }, []);

  return (
    <AuthGuard allowedRoles={['OCC']}>
      <div className="p-6 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Fleet Management</h1>

        {successMsg && <p className="text-green-500 text-sm mt-1">{successMsg}</p>}
        {errorMsg && <p className="text-red-500 text-sm mt-1">{errorMsg}</p>}

        <div className="mb-6 space-y-2">
          <input
            type="text"
            placeholder="Tail Number"
            value={tailNumber}
            onChange={(e) => setTailNumber(e.target.value)}
            className="border p-2 w-full"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as 'Active' | 'Inactive')}
            className="border p-2 w-full"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <button
            onClick={addAircraft}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            Add Aircraft
          </button>
        </div>

        {loading ? (
          <p>Loading fleet...</p>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tail Number</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fleet.map((aircraft) => (
                  <TableRow key={aircraft.id}>
                    <TableCell>
                      {editingId === aircraft.id ? (
                        <input
                          type="text"
                          value={editTail}
                          onChange={(e) => setEditTail(e.target.value)}
                          className="border p-1 rounded w-full"
                        />
                      ) : (
                        <>
                          ✈️ <strong>{aircraft.tail_number}</strong>
                        </>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === aircraft.id ? (
                        <select
                          value={editStatus}
                          onChange={(e) =>
                            setEditStatus(e.target.value as 'Active' | 'Inactive')
                          }
                          className="border p-1 rounded"
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      ) : (
                        aircraft.status
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === aircraft.id ? (
                        <>
                          <button
                            onClick={() => saveEdit(aircraft.id)}
                            className="text-green-500 text-sm mr-2"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-gray-500 text-sm"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(aircraft)}
                            className="text-blue-500 text-sm mr-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteAircraft(aircraft.id)}
                            className="text-red-500 text-sm"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>
    </AuthGuard>
  );
}