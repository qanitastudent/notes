// components/Navbar.tsx
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/utils/auth';

export default function Navbar() {
    const { isAuthenticated, logout } = useAuth();
    const router = useRouter();

    return (
        <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
            <Link href="/" className="text-2xl font-bold text-indigo-600">
                Notes Sharing
            </Link>
            <div className="flex gap-4">
                {isAuthenticated ? (
                <>
                    <button
                    onClick={() => router.push('/notes/create')}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    >
                    Create Note
                    </button>
                    <button
                    onClick={logout}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                    Logout
                    </button>
                </>
                ) : (
                <>
                    <Link
                    href="/login"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    >
                    Login
                    </Link>
                    <Link
                    href="/register"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                    Register
                    </Link>
                </>
                )}
            </div>
            </div>
        </div>
        </nav>
    );
}