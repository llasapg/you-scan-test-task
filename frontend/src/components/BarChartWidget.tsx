import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Widget } from '../types/widget';

interface BarChartWidgetProps {
  widget: Widget;
  onDelete: (id: string) => void;
}

const generateRandomData = () => {
  return Array.from({ length: 6 }, (_, i) => ({
    name: `Category ${i + 1}`,
    value: Math.floor(Math.random() * 100) + 20,
  }));
};

export default function BarChartWidget({ widget, onDelete }: BarChartWidgetProps) {
  const [data] = useState(generateRandomData());
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(widget.id);
    } catch (error) {
      console.error('Failed to delete widget:', error);
      setIsDeleting(false);
    }
  };

  return (
    <div className="widget">
      <div className="widget-header">
        <h3>Bar Chart</h3>
        <button 
          className="delete-btn" 
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? '...' : '×'}
        </button>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}


