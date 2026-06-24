import { useEffect, useState } from 'react';
import type { Widget } from './types/widget';
import { WidgetType } from './types/widget';
import { getWidgets, createWidget, updateWidget, deleteWidget } from './lib/api';
import LineChartWidget from './components/LineChartWidget';
import BarChartWidget from './components/BarChartWidget';
import TextWidget from './components/TextWidget';
import './App.css';

export default function App() {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const loadWidgets = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getWidgets();
      setWidgets(data);
    } catch (err) {
      setError('Failed to load widgets');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWidgets();
  }, []);

  const handleAddWidget = async (type: WidgetType) => {
    setCreating(true);
    try {
      await createWidget(type);
      await loadWidgets();
    } catch (err) {
      setError('Failed to create widget');
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateWidget = async (id: string, data: string) => {
    try {
      await updateWidget(id, data);
      await loadWidgets();
    } catch (err) {
      setError('Failed to update widget');
      console.error(err);
    }
  };

  const handleDeleteWidget = async (id: string) => {
    try {
      await deleteWidget(id);
      await loadWidgets();
    } catch (err) {
      setError('Failed to delete widget');
      console.error(err);
    }
  };

  const renderWidget = (widget: Widget) => {
    switch (widget.type) {
      case WidgetType.LINE_CHART:
        return <LineChartWidget key={widget.id} widget={widget} onDelete={handleDeleteWidget} />;
      case WidgetType.BAR_CHART:
        return <BarChartWidget key={widget.id} widget={widget} onDelete={handleDeleteWidget} />;
      case WidgetType.TEXT:
        return (
          <TextWidget
            key={widget.id}
            widget={widget}
            onUpdate={handleUpdateWidget}
            onDelete={handleDeleteWidget}
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Dashboard</h1>
        {error && <div className="error">{error}</div>}
      </header>

      <div className="controls">
        <button onClick={() => handleAddWidget(WidgetType.LINE_CHART)} disabled={creating}>
          Add Line Chart
        </button>
        <button onClick={() => handleAddWidget(WidgetType.BAR_CHART)} disabled={creating}>
          Add Bar Chart
        </button>
        <button onClick={() => handleAddWidget(WidgetType.TEXT)} disabled={creating}>
          Add Text Widget
        </button>
      </div>

      <div className="widgets-grid">
        {widgets.length === 0 ? (
          <div className="empty-state">
            <p>No widgets yet. Click one of the buttons above to add a widget.</p>
          </div>
        ) : (
          widgets.map(renderWidget)
        )}
      </div>
    </div>
  );
}

