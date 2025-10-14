import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import NoteCard from '@/components/NoteCard';
import { notesAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface Note {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  username: string;
  created_at: string;
  user_id: number;
}

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await notesAPI.getAll();
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Welcome to NotesApp
            </h1>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Bagikan pemikiran, ide, dan cerita Anda dengan dunia. Buat catatan indah dengan dukungan gambar dan markdown.
            </p>
            {!isAuthenticated && (
              <div className="flex justify-center space-x-4">
                <Link
                  href="/register"
                  className="px-8 py-3 bg-white text-primary-700 rounded-lg font-semibold hover:bg-primary-50 transition-colors text-lg"
                >
                  Get Started
                </Link>
                <Link
                  href="/notes"
                  className="px-8 py-3 bg-primary-700 text-white rounded-lg font-semibold hover:bg-primary-800 transition-colors text-lg border-2 border-white"
                >
                  Browse Notes
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">
                {notes.length}+
              </div>
              <div className="text-gray-600">Notes Shared</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">∞</div>
              <div className="text-gray-600">Ideas Created</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">💡</div>
              <div className="text-gray-600">Inspiration Shared</div>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Notes Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Latest Notes</h2>
          <Link
            href="/notes"
            className="text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1"
          >
            <span>View All</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No notes yet</h3>
            <p className="text-gray-600 mb-4">Be the first to create and share a note!</p>
            {isAuthenticated && (
              <Link
                href="/notes/create"
                className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition"
              >
                Create Your First Note
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.slice(0, 6).map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      {!isAuthenticated && (
        <div className="bg-primary-50 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Siap Membagikan Idemu?
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Bergabunglah dengan komunitas kami dan mulailah membuat catatan yang luar biasa hari ini. Gratis dan hanya membutuhkan waktu kurang dari satu menit!
              </p>
              <Link
                href="/register"
                className="inline-block px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors text-lg"
              >
                Daftar Sekarang
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}