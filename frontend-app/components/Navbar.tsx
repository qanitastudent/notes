import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/utils/auth';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  return (
    <header className="bg-gradient-to-r from-[#7b2cbf] to-[#3c096c] text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex items-center h-24 px-8 justify-between">
        {/* Logo kiri */}
        <div
          className="text-2xl font-bold cursor-pointer select-none ml-2"
          onClick={() => router.push('/')}
        >
          Notes App
        </div>

        {/* Tombol kanan */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <button
                onClick={() => router.push('/notes/create')}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full font-semibold shadow-md hover:scale-105 hover:shadow-xl transition-all duration-200"
              >
                Create
              </button>
              <button
                onClick={logout}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 rounded-full font-semibold shadow-md hover:scale-105 hover:shadow-xl transition-all duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-6 py-3 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full font-semibold shadow-md hover:scale-105 hover:shadow-xl transition-all duration-200"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full font-semibold shadow-md hover:scale-105 hover:shadow-xl transition-all duration-200"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
