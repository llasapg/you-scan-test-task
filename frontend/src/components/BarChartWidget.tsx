import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { Widget } from '../types/widget';

interface BarChartWidgetProps {
  widget: Widget;
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: string) => void;
}

const generateRPSData = () => {
  const endpoints = [
    { name: '/api/users', baseRPS: 850 },
    { name: '/api/products', baseRPS: 1250 },
    { name: '/api/orders', baseRPS: 420 },
    { name: '/api/auth', baseRPS: 680 },
    { name: '/api/search', baseRPS: 1580 },
    { name: '/graphql', baseRPS: 2100 },
  ];
  
  return endpoints.map(endpoint => {
    const variance = (Math.random() - 0.5) * 0.7;
    const burstFactor = Math.random() > 0.68 ? 1 + Math.random() * 0.45 : 1;
    const rps = endpoint.baseRPS * (1 + variance) * burstFactor;
    
    return {
      endpoint: endpoint.name,
      rps: Math.round(rps),
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
        <p style={{ margin: 0, fontWeight: 500, fontSize: '0.7rem' }}>{payload[0].payload.endpoint}</p>
        <p style={{ margin: '4px 0 0 0', color: '#5794f2' }}>
          {payload[0].value.toLocaleString()} req/s
        </p>
      </div>
    );
  }
  return null;
};

export default function BarChartWidget({ widget, onDelete, onUpdate }: BarChartWidgetProps) {
  const [data] = useState(generateRPSData());
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const fallbackTitle = 'API Endpoints - Requests/Second';
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

  // Color bars based on load (red for high, yellow for medium, blue for low)
  const getBarColor = (value: number) => {
    if (value > 1500) return '#f2495c'; // High load - red
    if (value > 1000) return '#ff9830'; // Medium load - orange
    return '#5794f2'; // Normal load - blue
  };

  return (
    <div className="widget">
      <div className="widget-header">
        <div className="panel-header-main">
          <div className="panel-title-block">
            <span className="panel-kind-badge">Bar chart</span>

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

            <span className="panel-meta">Endpoint traffic distribution · synthetic data</span>
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
            <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#262629" />
            <XAxis 
              dataKey="endpoint" 
              stroke="#a7a8a9"
              style={{ fontSize: '0.65rem' }}
              tick={{ fill: '#a7a8a9' }}
              angle={-15}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              stroke="#a7a8a9"
              style={{ fontSize: '0.75rem' }}
              tick={{ fill: '#a7a8a9' }}
              tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="rps" radius={[2, 2, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.rps)} />
              ))}
            </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}


