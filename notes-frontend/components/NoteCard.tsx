import { useState } from 'react';
import Link from 'next/link';

interface Note {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  username: string;
  created_at: string;
  user_id: number;
}

interface NoteCardProps {
  note: Note;
  currentUserId?: number;
  onDelete?: (id: number) => void;
}

export default function NoteCard({ note, currentUserId, onDelete }: NoteCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const isOwner = currentUserId === note.user_id;

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    
    setIsDeleting(true);
    if (onDelete) {
      await onDelete(note.id);
    }
    setIsDeleting(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
      {note.image_url && (
        <div className="relative h-48 overflow-hidden bg-gray-100">
          <img
            src={note.image_url}
            alt={note.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2 flex-1">
            {note.title}
          </h3>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {note.content}
        </p>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-700 font-semibold text-xs">
                {note.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{note.username}</p>
              <p className="text-xs text-gray-500">{formatDate(note.created_at)}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Link
              href={`/notes/${note.id}`}
              className="px-3 py-1.5 text-sm bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition font-medium"
            >
              View
            </Link>
            {isOwner && onDelete && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-3 py-1.5 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition font-medium disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}