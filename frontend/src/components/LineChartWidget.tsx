import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Widget } from '../types/widget';

interface LineChartWidgetProps {
  widget: Widget;
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: string) => void;
}

const generateMonthlyIncomeData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  
  // Generate more dynamic monthly income with visible swings and growth trend
  const baseIncome = 42000;
  return months.slice(0, currentMonth + 1).map((month, i) => {
    const growthFactor = 1 + (i * 0.03);
    const variance = (Math.random() - 0.5) * 0.42;
    const seasonalFactor = 1 + Math.sin(i * Math.PI / 4) * 0.16;
    const spikeFactor = Math.random() > 0.72 ? 1 + Math.random() * 0.22 : 1;
    const income = baseIncome * growthFactor * (1 + variance) * seasonalFactor * spikeFactor;
    
    return {
      month,
      income: Math.round(income),
    };
  });
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#18181b',
        border: '1px solid #262629',
        padding: '8px 12px',
        borderRadius: '2px',
        fontSize: '0.75rem',
        color: '#d8d9da'
      }}>
        <p style={{ margin: 0, fontWeight: 500 }}>{payload[0].payload.month}</p>
        <p style={{ margin: '4px 0 0 0', color: '#73bf69' }}>
          ${payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export default function LineChartWidget({ widget, onDelete, onUpdate }: LineChartWidgetProps) {
  const [data] = useState(generateMonthlyIncomeData());
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const fallbackTitle = 'Monthly Revenue (2026)';
  const persistedTitle = widget.data || fallbackTitle;
  const [title, setTitle] = useState(persistedTitle);

  useEffect(() => {
    setTitle(persistedTitle);
  }, [persistedTitle]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(widget.id);
    } catch (error) {
      console.error('Failed to delete widget:', error);
      setIsDeleting(false);
    }
  };

  const handleUpdateTitle = async () => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setTitle(persistedTitle);
      setIsEditingTitle(false);
      return;
    }

    if (trimmedTitle !== persistedTitle) {
      try {
        await onUpdate(widget.id, trimmedTitle);
      } catch (error) {
        console.error('Failed to update title:', error);
        setTitle(persistedTitle);
      }
    }

    setIsEditingTitle(false);
  };

  return (
    <div className="widget">
      <div className="widget-header">
        <div className="panel-header-main">
          <div className="panel-title-block">
            <span className="panel-kind-badge">Line chart</span>

            {isEditingTitle ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleUpdateTitle();
                  if (e.key === 'Escape') {
                    setTitle(persistedTitle);
                    setIsEditingTitle(false);
                  }
                }}
                onBlur={handleUpdateTitle}
                className="widget-title-input"
                autoFocus
              />
            ) : (
              <h3
                className="widget-title"
                onClick={() => setIsEditingTitle(true)}
                title="Click to edit title"
              >
                {title}
              </h3>
            )}

            <span className="panel-meta">Monthly revenue trend · mock telemetry</span>
          </div>

          <div className="panel-header-actions">
            <button className="panel-action-btn" onClick={() => setIsEditingTitle(true)} title="Edit panel title">
              Edit
            </button>
            <button
              className="panel-action-btn danger"
              onClick={handleDelete}
              disabled={isDeleting}
              title="Delete panel"
            >
              {isDeleting ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
      <div className="chart-panel-body">
        <div className="chart-surface">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#262629" />
            <XAxis 
              dataKey="month" 
              stroke="#a7a8a9" 
              style={{ fontSize: '0.75rem' }}
              tick={{ fill: '#a7a8a9' }}
            />
            <YAxis 
              stroke="#a7a8a9"
              style={{ fontSize: '0.75rem' }}
              tick={{ fill: '#a7a8a9' }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="income" 
              stroke="#73bf69" 
              strokeWidth={2}
              dot={{ fill: '#73bf69', r: 3 }}
              activeDot={{ r: 5 }}
              name="Revenue"
            />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}


