'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PieChart, Pie, Cell, Tooltip as RechartsTooltip,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  BarChart, Bar, ResponsiveContainer
} from 'recharts';

const pieData = [
  { name: 'Free', value: 4 },
  { name: 'Occupied', value: 3 },
  { name: 'Unserviceable', value: 1 },
];

const lineData = [
  { month: 'Jan', usage: 20 },
  { month: 'Feb', usage: 40 },
  { month: 'Mar', usage: 35 },
  { month: 'Apr', usage: 50 },
  { month: 'May', usage: 45 },
];

const barData = [
  { month: 'Jan', assignments: 15 },
  { month: 'Feb', assignments: 25 },
  { month: 'Mar', assignments: 22 },
  { month: 'Apr', assignments: 30 },
  { month: 'May', assignments: 28 },
];

const COLORS = ['#4ade80', '#f87171', '#a3a3a3'];

export default function ReportsPage() {
  return (
    <div className="min-h-screen p-8 bg-gray-50 flex flex-col gap-8 items-center">
      <h1 className="text-4xl font-bold text-gray-800">Reports Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Dock Occupancy</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Historical Dock Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <RechartsTooltip />
                <Line type="monotone" dataKey="usage" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Aircraft Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="assignments" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}