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
        <h3>Text Widget</h3>
        <button 
          className="delete-btn" 
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? '...' : '×'}
        </button>
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
              <button onClick={() => setIsEditing(false)} disabled={isSaving}>
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="text-display">
              {text || 'Click edit to add text'}
            </div>
            <button onClick={() => setIsEditing(true)}>Edit</button>
          </>
        )}
      </div>
    </div>
  );
}


