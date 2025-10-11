// pages/login.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { api } from '@/utils/api';
import Head from 'next/head';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.login(formData);
      router.push('/');
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Login failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const container = document.getElementById('container');
    const signInButton = document.getElementById('signIn');
    signInButton?.addEventListener('click', () => {
      container?.classList.remove('right-panel-active');
    });
  }, []);

  return (
    <>
      <Head>
        <title>Login</title>
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
          rel="stylesheet"
        />
      </Head>

      <div className="auth-page">
        <div className="container" id="container">
          <div className="form-container sign-in-container">
            <form onSubmit={handleSubmit}>
              <h1>Sign In</h1>

              <input
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
              {error && <p className="error">{error}</p>}
              <button type="submit" className="button">
                {loading ? 'Loading...' : 'Sign In'}
              </button>

              <p className="follow-me text-gray-600 text-sm">Follow me</p>

              <div className="social-container mt-2">
                <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
                <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
                <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
              </div>
            </form>
          </div>

          <div className="overlay-container">
            <div className="overlay">
              <div className="overlay-panel overlay-left">
                <h1>Welcome Back!</h1>
                <p>Login with your personal info</p>
                <button className="ghost" id="signIn">Sign In</button>
              </div>
              <div className="overlay-panel overlay-right">
                <h1>Hello, Friend!</h1>
                <p>Before adding a note, log in to your account</p>
                <button
                  className="ghost ghost-register"
                  onClick={() => router.push('/register')}
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>

        <footer>
          <p>
            Created with <i className="fa fa-heart"></i> by{' '}
            <a target="_blank" href="https://florin-pop.com">Ayu Qanita Putri</a>
          </p>
        </footer>
      </div>
    </>
  );
}
