// pages/notes/index.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { api, Note } from "../../utils/api";
import Navbar from "../../components/Navbar";

export default function Notes() {
    const router = useRouter();
    const [notes, setNotes] = useState<Note[]>([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

  // Fetch notes dari backend
    const fetchNotes = async () => {
    try {
        const data = await api.getNotes();
        setNotes(data);
    } catch (err: unknown) {
        console.error(err);
        const message = err instanceof Error ? err.message : "Failed to fetch notes";
        setError(message);
    }
    };

  // Create note baru
    const createNote = async () => {
    if (!title.trim() || !content.trim()) return;
    setLoading(true);
    setError("");

    try {
        await api.createNote({ title, content });
        setTitle("");
        setContent("");
        fetchNotes();
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to create note";
        setError(message);
    } finally {
        setLoading(false);
    }
    };

    useEffect(() => {
    fetchNotes();
    }, []);

    return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />

        <div className="max-w-xl mx-auto mt-6 p-4">
        <h1 className="text-2xl font-bold mb-4">Your Notes</h1>

        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
            </div>
        )}

        <div className="mb-4 flex flex-col gap-2">
            <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 rounded"
            />
            <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="border p-2 rounded"
            />
            <button
            onClick={createNote}
            disabled={loading}
            className="bg-green-600 text-white p-2 rounded hover:bg-green-700 transition disabled:bg-gray-400"
            >
            {loading ? "Creating..." : "Add Note"}
            </button>
        </div>

        <div className="flex flex-col gap-2">
            {notes.map((note) => (
            <div
                key={note.id}
                className="border p-2 rounded hover:bg-gray-100 cursor-pointer"
                onClick={() => router.push(`/notes/${note.id}`)}
            >
                <h2 className="font-bold">{note.title}</h2>
                <p>{note.content}</p>
                <small>By: {note.username}</small>
            </div>
            ))}
        </div>
        </div>
    </div>
    );
}
