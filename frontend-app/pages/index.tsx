import { useEffect, useState } from 'react';
import { api, Note } from '@/utils/api';
import Navbar from '@/components/Navbar';
import NoteCard from '@/components/NoteCard';

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const data = await api.getNotes();
      setNotes(data || []);
    } catch (error) {
      console.error('Failed to load notes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Hapus note permanen
  const handleDeleteNote = async (id: number) => {
    try {
      await api.deleteNote(id); // panggil backend untuk hapus
      setNotes((prev) => prev.filter((note) => note.id !== id)); // hapus di UI
    } catch (error) {
      console.error('Failed to delete note:', error);
      alert('Gagal menghapus catatan. Coba lagi.');
    }
  };


  const handleUpdateNote = (updatedNote: Note) => {
    setNotes((prev) =>
      prev.map((note) => (note.id === updatedNote.id ? updatedNote : note))
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-customBg">
        <div className="text-xl font-semibold text-white animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-customBg text-gray-900"
    >
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-white mb-2">📒 My Notes</h1>
          <p className="text-white/80 text-lg">Organize your thoughts, ideas, and reminders in one place.</p>
        </header>

        {notes.length === 0 ? (
          <div className="text-center py-20 text-white/80">
            <p className="text-xl">No notes yet. Be the first to create one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onDelete={handleDeleteNote}
                onUpdate={handleUpdateNote}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
