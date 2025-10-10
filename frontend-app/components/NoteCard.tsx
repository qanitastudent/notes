import React from 'react';
import { Note } from '@/utils/api';

interface NoteCardProps {
  note: Note;
  onDelete: (id: number) => void;
  onUpdate?: (note: Note) => void;
}

export default function NoteCard({ note, onDelete }: NoteCardProps) {
  return (
    <div className="bg-noteCardBg p-6 rounded-2xl shadow-lg hover:bg-noteCardHover transition-all duration-200">
      <h3 className="text-xl font-semibold mb-2 text-noteText">{note.title}</h3>
      <p className="text-noteText mb-4">{note.content}</p>
      <div className="flex justify-end gap-2">
        <button
          onClick={() => onDelete(note.id)}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
