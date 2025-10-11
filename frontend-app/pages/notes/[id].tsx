import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { api, Note } from '@/utils/api';
import Navbar from '@/components/Navbar';

export default function NoteDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [error, setError] = useState('');
  const [isAuth, setIsAuth] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsAuth(!!localStorage.getItem('token'));
    }
  }, []);

  const noteId = Array.isArray(id) ? Number(id[0]) : Number(id);

  const loadNote = useCallback(async () => {
    if (!noteId) return;

    try {
      const data = await api.getNoteById(noteId);
      setNote(data);
      setFormData({ title: data.title, content: data.content });
    } catch (err: unknown) {
      console.error('Failed to load note:', err);
      setError('Note not found');
    } finally {
      setLoading(false);
    }
  }, [noteId]);

  useEffect(() => {
    if (id) {
      loadNote();
    }
  }, [id, loadNote]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const updated = await api.updateNote(noteId, formData);
      setNote(updated);
      setEditing(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update note';
      setError(message);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      await api.deleteNote(noteId);
      router.replace('/');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete note';
      setError(message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          <p className="text-lg font-medium text-gray-700">Loading note...</p>
        </div>
      </div>
    );
  }

  if (error && !note) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="text-center bg-white rounded-3xl p-12 shadow-2xl">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-gray-800 mb-4">{error}</p>
          <Link 
            href="/" 
            className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!note) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Hero Image */}
          {note.image_url && !editing && (
            <div className="relative w-full h-96 bg-gray-100">
              {note.image_url.startsWith('data:') ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={note.image_url}
                  alt={note.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image
                  src={`${API_URL}${note.image_url}`}
                  alt={note.title}
                  fill
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  className="object-cover"
                  priority
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
          )}

          <div className="p-8 md:p-12">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            )}

            {editing ? (
              <form onSubmit={handleUpdate} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all text-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Content
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={12}
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all resize-none"
                    required
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold hover:shadow-xl hover:scale-105 transition-all"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setFormData({ title: note.title, content: note.content });
                    }}
                    className="flex-1 px-6 py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
                  <div className="flex-1">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                      {note.title}
                    </h1>
                    <div className="flex items-center gap-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                          {note.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium">{note.username}</span>
                      </div>
                      <span className="text-gray-400">•</span>
                      <span>{new Date(note.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                  </div>

                  {isAuth && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => setEditing(true)}
                        className="px-6 py-3 bg-yellow-500 text-white rounded-xl font-semibold hover:bg-yellow-600 transition-colors shadow-lg"
                      >
                        Edit
                      </button>
                      <button
                        onClick={handleDelete}
                        className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors shadow-lg"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                <div className="prose max-w-none">
                  <div className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {note.content}
                  </div>
                </div>
              </>
            )}

            <div className="mt-12 pt-8 border-t border-gray-200">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold group"
              >
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to All Notes
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}