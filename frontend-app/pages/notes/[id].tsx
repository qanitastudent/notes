// pages/notes/[id].tsx
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
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

  // Cek login di client-side untuk menghindari hydration error
    useEffect(() => {
    if (typeof window !== 'undefined') {
        setIsAuth(!!localStorage.getItem('token'));
    }
    }, []);

  // Convert id ke number dengan aman
    const noteId = Array.isArray(id) ? Number(id[0]) : Number(id);

  // loadNote menggunakan useCallback agar stabil sebagai dependency
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
        const message =
        err instanceof Error ? err.message : 'Failed to update note';
        setError(message);
    }
    };

    const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
        await api.deleteNote(noteId);
      router.replace('/'); // reload homepage safely
    } catch (err: unknown) {
        const message =
        err instanceof Error ? err.message : 'Failed to delete note';
        setError(message);
    }
    };

    if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
        </div>
    );
    }

    if (error && !note) {
    return (
        <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
            <p className="text-xl text-red-600 mb-4">{error}</p>
            <Link href="/" className="text-indigo-600 hover:underline">
            Back to Home
            </Link>
        </div>
        </div>
    );
    }

    if (!note) return null;

    return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-xl p-8">
            {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
            </div>
            )}

            {editing ? (
            <form onSubmit={handleUpdate} className="space-y-6">
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                </label>
                <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    required
                />
                </div>

                <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content
                </label>
                <textarea
                    value={formData.content}
                    onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                    }
                    rows={10}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    required
                />
                </div>

                <div className="flex gap-4">
                <button
                    type="submit"
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                    Save Changes
                </button>
                <button
                    type="button"
                    onClick={() => {
                    setEditing(false);
                    setFormData({ title: note.title, content: note.content });
                    }}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                    Cancel
                </button>
                </div>
            </form>
            ) : (
            <>
                <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    {note.title}
                    </h1>
                    <div className="flex gap-4 text-sm text-gray-500">
                    <span>By {note.username}</span>
                    <span>•</span>
                    <span>{new Date(note.created_at).toLocaleDateString()}</span>
                    </div>
                </div>

                {isAuth && (
                    <div className="flex gap-2">
                    <button
                        onClick={() => setEditing(true)}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                    >
                        Edit
                    </button>
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                        Delete
                    </button>
                    </div>
                )}
                </div>

                <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
                </div>
            </>
            )}

            <Link
            href="/"
            className="inline-block mt-8 text-indigo-600 hover:underline"
            >
            ← Back to All Notes
            </Link>
        </div>
        </main>
    </div>
    );
}
