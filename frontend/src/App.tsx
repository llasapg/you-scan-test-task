import { useCallback, useEffect, useState } from 'react';
import type { Widget } from './types/widget';
import type { Dashboard } from './types/dashboard';
import { WidgetType } from './types/widget';
import { 
  getWidgets, createWidget, updateWidget, deleteWidget,
  getDashboards, createDashboard, updateDashboard, deleteDashboard
} from './lib/api';
import LineChartWidget from './components/LineChartWidget';
import BarChartWidget from './components/BarChartWidget';
import TextWidget from './components/TextWidget';
import './App.css';

const LAST_DASHBOARD_STORAGE_KEY = 'dashboard:last-selected-id';

const formatUpdatedAt = (value: string) =>
  new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));

export default function App() {
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [currentDashboard, setCurrentDashboard] = useState<Dashboard | null>(null);
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [isCreatingDashboard, setIsCreatingDashboard] = useState(false);
  const [editingDashboard, setEditingDashboard] = useState(false);
  const [dashboardName, setDashboardName] = useState('');
  const [newDashboardName, setNewDashboardName] = useState('');
  const [isSavingDashboardName, setIsSavingDashboardName] = useState(false);
  const [showDeleteDashboardConfirm, setShowDeleteDashboardConfirm] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadDashboards = useCallback(async () => {
    setLoading(true);

    try {
      setError(null);
      const data = await getDashboards();
      const savedDashboardId = localStorage.getItem(LAST_DASHBOARD_STORAGE_KEY);

      setDashboards(data);

      setCurrentDashboard((previousDashboard: Dashboard | null) => {
        if (data.length === 0) {
          localStorage.removeItem(LAST_DASHBOARD_STORAGE_KEY);
          return null;
        }

        if (savedDashboardId) {
          const savedDashboard = data.find((dashboard) => dashboard.id === savedDashboardId);

          if (savedDashboard) {
            return savedDashboard;
          }
        }

        if (!previousDashboard) {
          return data[0];
        }

        return data.find((dashboard) => dashboard.id === previousDashboard.id) ?? data[0];
      });
    } catch (err) {
      setError('Failed to load dashboards');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadWidgets = useCallback(async () => {
    if (!currentDashboard) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await getWidgets(currentDashboard.id);
      setWidgets(data);
    } catch (err) {
      setError('Failed to load widgets');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentDashboard]);

  useEffect(() => {
    loadDashboards();
  }, [loadDashboards]);

  useEffect(() => {
    if (currentDashboard) {
      loadWidgets();
      return;
    }

    setWidgets([]);
    setLoading(false);
  }, [currentDashboard, loadWidgets]);

  useEffect(() => {
    if (currentDashboard) {
      localStorage.setItem(LAST_DASHBOARD_STORAGE_KEY, currentDashboard.id);
      return;
    }

    localStorage.removeItem(LAST_DASHBOARD_STORAGE_KEY);
  }, [currentDashboard]);

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await loadDashboards();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleAddWidget = async (type: WidgetType) => {
    if (!currentDashboard) return;
    
    setCreating(true);
    try {
      await createWidget(currentDashboard.id, type);
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

  const handleCreateDashboard = async () => {
    const trimmedName = newDashboardName.trim();

    if (!trimmedName) {
      setError('Dashboard name cannot be empty');
      return;
    }

    try {
      setCreating(true);
      setError(null);
      const newDashboard = await createDashboard(trimmedName);
      setDashboards((previousDashboards) => [...previousDashboards, newDashboard]);
      setCurrentDashboard(newDashboard);
      setNewDashboardName('');
      setIsCreatingDashboard(false);
      setShowDeleteDashboardConfirm(false);
    } catch (err) {
      setError('Failed to create dashboard');
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateDashboard = async () => {
    if (!currentDashboard) return;

    const trimmedName = dashboardName.trim();

    if (!trimmedName) {
      setDashboardName(currentDashboard.name);
      setEditingDashboard(false);
      setError('Dashboard name cannot be empty');
      return;
    }

    try {
      setIsSavingDashboardName(true);
      setError(null);
      const updatedDashboard = await updateDashboard(currentDashboard.id, trimmedName);
      setDashboards((previousDashboards) =>
        previousDashboards.map((dashboard) =>
          dashboard.id === updatedDashboard.id ? updatedDashboard : dashboard,
        ),
      );
      setCurrentDashboard(updatedDashboard);
      setDashboardName(updatedDashboard.name);
      setEditingDashboard(false);
    } catch (err) {
      setError('Failed to update dashboard');
      console.error(err);
    } finally {
      setIsSavingDashboardName(false);
    }
  };

  const handleDeleteDashboard = async () => {
    if (!currentDashboard) return;

    try {
      await deleteDashboard(currentDashboard.id);
      setDashboards((previousDashboards) => {
        const updatedDashboards = previousDashboards.filter((dashboard) => dashboard.id !== currentDashboard.id);
        setCurrentDashboard(updatedDashboards[0] ?? null);
        return updatedDashboards;
      });
      setEditingDashboard(false);
      setDashboardName('');
      setShowDeleteDashboardConfirm(false);
    } catch (err) {
      setError('Failed to delete dashboard');
      console.error(err);
    }
  };

  const startEditingDashboard = () => {
    if (currentDashboard) {
      setDashboardName(currentDashboard.name);
      setEditingDashboard(true);
      setShowDeleteDashboardConfirm(false);
    }
  };

  const cancelDashboardEditing = () => {
    setDashboardName(currentDashboard?.name ?? '');
    setEditingDashboard(false);
  };

  const requestDeleteDashboard = () => {
    setEditingDashboard(false);
    setShowDeleteDashboardConfirm(true);
  };

  const cancelDeleteDashboard = () => {
    setShowDeleteDashboardConfirm(false);
  };

  const renderWidget = (widget: Widget) => {
    switch (widget.type) {
      case WidgetType.LINE_CHART:
        return <LineChartWidget key={widget.id} widget={widget} onDelete={handleDeleteWidget} onUpdate={handleUpdateWidget} />;
      case WidgetType.BAR_CHART:
        return <BarChartWidget key={widget.id} widget={widget} onDelete={handleDeleteWidget} onUpdate={handleUpdateWidget} />;
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

  if (loading && dashboards.length === 0) {
    return (
      <div className="app">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="sidebar-brand-mark">●</span>
          <div>
            <p className="sidebar-eyebrow">Observability</p>
            <h1>Dashboards</h1>
          </div>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-section-header">
            <span>Your dashboards</span>
            <span className="sidebar-badge">{dashboards.length}</span>
          </div>

          <div className="dashboard-selector">
            {dashboards.map((dashboard) => (
              <button
                key={dashboard.id}
                className={`dashboard-tab ${currentDashboard?.id === dashboard.id ? 'active' : ''}`}
                onClick={() => {
                  setEditingDashboard(false);
                  setShowDeleteDashboardConfirm(false);
                  setCurrentDashboard(dashboard);
                }}
              >
                <span className="dashboard-tab-name">{dashboard.name}</span>
                <span className="dashboard-tab-meta">{formatUpdatedAt(dashboard.updatedAt)}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="sidebar-section sidebar-section-create">
          <div className="sidebar-section-header">
            <span>Create dashboard</span>
          </div>

          {isCreatingDashboard ? (
            <div className="dashboard-create-card">
              <input
                type="text"
                value={newDashboardName}
                onChange={(e) => setNewDashboardName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    void handleCreateDashboard();
                  }

                  if (e.key === 'Escape') {
                    setIsCreatingDashboard(false);
                    setNewDashboardName('');
                  }
                }}
                className="dashboard-name-input"
                placeholder="Production overview"
                autoFocus
              />
              <div className="dashboard-form-actions">
                <button className="action-btn primary" onClick={() => void handleCreateDashboard()} disabled={creating}>
                  {creating ? 'Creating...' : 'Create'}
                </button>
                <button
                  className="action-btn secondary"
                  onClick={() => {
                    setIsCreatingDashboard(false);
                    setNewDashboardName('');
                  }}
                  disabled={creating}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              className="create-dashboard-btn"
              onClick={() => {
                setError(null);
                setIsCreatingDashboard(true);
                setShowDeleteDashboardConfirm(false);
              }}
            >
              + New dashboard
            </button>
          )}
        </div>
      </aside>

      <main className="app">
        <header className="header">
          <div className="header-topbar">
            <div>
              <p className="page-kicker">Dashboard</p>
              {currentDashboard ? (
                editingDashboard ? (
                  <div className="dashboard-title-section is-editing">
                    <input
                      type="text"
                      value={dashboardName}
                      onChange={(e) => setDashboardName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          void handleUpdateDashboard();
                        }

                        if (e.key === 'Escape') {
                          cancelDashboardEditing();
                        }
                      }}
                      className="dashboard-name-input dashboard-name-input-inline"
                      autoFocus
                    />
                    <div className="dashboard-form-actions">
                      <button
                        className="action-btn primary"
                        onClick={() => void handleUpdateDashboard()}
                        disabled={isSavingDashboardName}
                      >
                        {isSavingDashboardName ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        className="action-btn secondary"
                        onClick={cancelDashboardEditing}
                        disabled={isSavingDashboardName}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="dashboard-title-row">
                    <div className="dashboard-title-block">
                      <h2 className="dashboard-title">{currentDashboard.name}</h2>
                      <p className="dashboard-subtitle">
                        {widgets.length} panel{widgets.length === 1 ? '' : 's'} · Updated {formatUpdatedAt(currentDashboard.updatedAt)}
                      </p>
                    </div>

                    <div className="dashboard-header-actions">
                      <button className="action-btn secondary" onClick={() => void handleRefresh()} disabled={isRefreshing} title="Refresh dashboard data">
                        {isRefreshing ? 'Refreshing...' : 'Refresh'}
                      </button>
                      <button className="action-btn secondary" onClick={startEditingDashboard} title="Edit dashboard title">
                        Rename
                      </button>
                      <button className="action-btn danger" onClick={requestDeleteDashboard} title="Delete dashboard">
                        Delete
                      </button>
                    </div>
                  </div>
                )
              ) : (
                <div className="dashboard-title-block">
                  <h2 className="dashboard-title">No dashboard selected</h2>
                  <p className="dashboard-subtitle">Create a dashboard from the left panel to start building widgets.</p>
                </div>
              )}
            </div>
          </div>

          {currentDashboard && !editingDashboard && (
            <div className="dashboard-toolbar">
              <div className="dashboard-toolbar-copy">
                <span className="dashboard-toolbar-title">Add panel</span>
                <span className="dashboard-toolbar-subtitle">Choose a widget type to place it on the dashboard.</span>
              </div>

              <div className="dashboard-toolbar-actions">
                <button onClick={() => handleAddWidget(WidgetType.LINE_CHART)} disabled={creating}>
                  + Line chart
                </button>
                <button onClick={() => handleAddWidget(WidgetType.BAR_CHART)} disabled={creating}>
                  + Bar chart
                </button>
                <button onClick={() => handleAddWidget(WidgetType.TEXT)} disabled={creating}>
                  + Text panel
                </button>
              </div>
            </div>
          )}

          {showDeleteDashboardConfirm && currentDashboard && (
            <div className="danger-banner" role="alert">
              <div>
                <strong>Delete dashboard?</strong>
                <p>
                  This will remove <span className="danger-banner-name">{currentDashboard.name}</span> and all its current panels.
                </p>
              </div>

              <div className="danger-banner-actions">
                <button className="action-btn secondary" onClick={cancelDeleteDashboard}>
                  Cancel
                </button>
                <button className="action-btn danger" onClick={handleDeleteDashboard}>
                  Confirm delete
                </button>
              </div>
            </div>
          )}

          {error && <div className="error">{error}</div>}
        </header>

        {currentDashboard && (
          <>
            <div className="widgets-grid">
              {loading ? (
                <div className="loading">Loading widgets...</div>
              ) : widgets.length === 0 ? (
                <div className="empty-state">
                  <p>No panels yet. Add a chart or text panel to populate this dashboard.</p>
                </div>
              ) : (
                widgets.map(renderWidget)
              )}
            </div>
          </>
        )}

        {!currentDashboard && dashboards.length === 0 && (
          <div className="empty-state empty-state-standalone">
            <p>No dashboards yet. Create your first dashboard from the left panel.</p>
          </div>
        )}
      </main>
    </div>
  );
}

