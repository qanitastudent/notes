import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import NoteCard from '@/components/NoteCard';
import { notesAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

interface Note {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  username: string;
  created_at: string;
  user_id: number;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'my'>('all');
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    filterNotes();
  }, [notes, searchQuery, filter, user]);

  const fetchNotes = async () => {
    try {
      const response = await notesAPI.getAll();
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast.error('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  const filterNotes = () => {
    let filtered = [...notes];

    // Filter by ownership
    if (filter === 'my' && user) {
      filtered = filtered.filter(note => note.user_id === user.id);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredNotes(filtered);
  };

  const handleDelete = async (id: number) => {
    try {
      await notesAPI.delete(id);
      toast.success('Note deleted successfully');
      setNotes(notes.filter(note => note.id !== id));
    } catch (error: any) {
      console.error('Error deleting note:', error);
      toast.error(error.response?.data?.error || 'Failed to delete note');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">All Notes</h1>
          <p className="text-gray-600">Discover and explore shared notes from the community</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center space-x-2">
              {isAuthenticated && (
                <>
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      filter === 'all'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All Notes
                  </button>
                  <button
                    onClick={() => setFilter('my')}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      filter === 'my'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    My Notes
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold">{filteredNotes.length}</span> note{filteredNotes.length !== 1 && 's'}
            {searchQuery && (
              <span> matching "<span className="font-semibold">{searchQuery}</span>"</span>
            )}
          </p>
        </div>

        {/* Notes Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery ? 'No notes found' : filter === 'my' ? 'You haven\'t created any notes yet' : 'No notes available'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery
                ? 'Try adjusting your search'
                : filter === 'my'
                ? 'Create your first note to get started!'
                : 'Be the first to share a note!'}
            </p>
            {isAuthenticated && (
              <button
                onClick={() => router.push('/notes/create')}
                className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition"
              >
                Create Note
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                currentUserId={user?.id}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}