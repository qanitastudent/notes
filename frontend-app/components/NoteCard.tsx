import React from 'react';
import Image from 'next/image';
import { Note } from '@/utils/api';
import { useRouter } from 'next/router';

interface NoteCardProps {
  note: Note;
  onDelete: (id: number) => void;
  onUpdate?: (note: Note) => void;
}

export default function NoteCard({ note, onDelete }: NoteCardProps) {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  return (
    <div
      className="group relative bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
      onClick={() => router.push(`/notes/${note.id}`)}
    >
      {/* Image Section */}
      {note.image_url && (
        <div className="relative h-56 overflow-hidden bg-gray-100">
          {note.image_url.startsWith('data:') ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={note.image_url}
              alt={note.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <Image
              src={`${API_URL}${note.image_url}`}
              alt={note.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      )}

      {/* Content Section */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-800 line-clamp-2 flex-1 pr-2">
            {note.title}
          </h3>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(note.id);
              }}
              className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors shadow-md"
              title="Delete"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <p className="text-gray-600 line-clamp-3 mb-4 leading-relaxed">
          {note.content}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-semibold">
              {note.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">{note.username}</p>
              <p className="text-xs text-gray-400">
                {new Date(note.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/notes/${note.id}`);
            }}
            className="text-sm font-medium text-purple-600 hover:text-purple-700 flex items-center gap-1 group/btn"
          >
            Read more
            <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Decorative corner */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-purple-200/30 to-transparent rounded-bl-full" />
    </div>
  );
}