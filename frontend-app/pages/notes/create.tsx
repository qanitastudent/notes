import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { api } from '@/utils/api';
import { requireAuth } from '@/utils/auth';
import Navbar from '@/components/Navbar';

function CreateNotePage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        content: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
        await api.createNote(formData);
        router.push('/');
    } catch (err: unknown) {
      // Type guard untuk error
        const message = err instanceof Error ? err.message : 'Failed to create note';
        setError(message);
    } finally {
        setLoading(false);
    }
    };

    return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />

        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-xl p-8">
            <h1 className="text-3xl font-bold text-indigo-600 mb-8">Create New Note</h1>

            {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
            </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title
                </label>
                <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter note title"
                required
                />
            </div>

            <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Content
                </label>
                <textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={10}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Write your note here..."
                required
                />
            </div>

            <div className="flex gap-4">
                <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:bg-gray-400"
                >
                {loading ? 'Creating...' : 'Create Note'}
                </button>
                <Link
                href="/"
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition text-center"
                >
                Cancel
                </Link>
            </div>
            </form>
        </div>
        </main>
    </div>
    );
}

export default requireAuth(CreateNotePage);
