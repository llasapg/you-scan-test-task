import { useState } from 'react';
import type { Widget } from '../types/widget';

interface TextWidgetProps {
  widget: Widget;
  onUpdate: (id: string, data: string) => void;
  onDelete: (id: string) => void;
}

export default function TextWidget({ widget, onUpdate, onDelete }: TextWidgetProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(widget.data || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const cancelEditing = () => {
    setText(widget.data || '');
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdate(widget.id, text);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update widget:', error);
    } finally {
      setIsSaving(false);
    }
  };

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
    <div className="widget text-widget">
      <div className="widget-header">
        <div className="panel-header-main">
          <div className="panel-title-block">
            <span className="panel-kind-badge">Text</span>
            <div className="panel-title-row">
              <h3>Notes</h3>
            </div>
            <span className="panel-meta">Markdown-like notes and runbook snippets</span>
          </div>

          <div className="panel-header-actions">
            {!isEditing ? (
              <button className="panel-action-btn" onClick={() => setIsEditing(true)} title="Edit notes">
                Edit
              </button>
            ) : null}
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
      <div className="text-widget-content">
        {isEditing ? (
          <>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter your text here..."
              autoFocus
            />
            <div className="button-group">
              <button onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save'}
              </button>
              <button onClick={cancelEditing} disabled={isSaving}>
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="text-display">
              {text || 'Click edit to add text'}
            </div>
          </>
        )}
      </div>
    </div>
  );
}


