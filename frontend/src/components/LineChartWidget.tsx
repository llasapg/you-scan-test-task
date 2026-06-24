import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Widget } from '../types/widget';

interface LineChartWidgetProps {
  widget: Widget;
  onDelete: (id: string) => void;
}

const generateRandomData = () => {
  return Array.from({ length: 7 }, (_, i) => ({
    name: `Day ${i + 1}`,
    value: Math.floor(Math.random() * 100) + 20,
  }));
};

export default function LineChartWidget({ widget, onDelete }: LineChartWidgetProps) {
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
        <h3>Line Chart</h3>
        <button 
          className="delete-btn" 
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? '...' : '×'}
        </button>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}


