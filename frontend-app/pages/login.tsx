// pages/login.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import { api } from '@/utils/api';
import Link from 'next/link';
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

  return (
    <>
      <Head>
        <title>Login / Register</title>
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
          rel="stylesheet"
        />
      </Head>

      <h2>Welcome to Notes App</h2>
      <div className="container" id="container">
        {/* Sign Up Form */}
        <div className="form-container sign-up-container">
          <form>
            <h1>Create Account</h1>
            <div className="social-container">
              <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
              <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
            </div>
            <span>or use your email for registration</span>
            <input type="text" placeholder="Name" />
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <button type="button">Sign Up</button>
          </form>
        </div>

        {/* Login Form */}
        <div className="form-container sign-in-container">
          <form onSubmit={handleSubmit}>
            <h1>Sign In</h1>
            <div className="social-container">
              <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
              <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
            </div>
            <span>or use your account</span>

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

            {error && <p style={{ color: 'red', fontSize: 12 }}>{error}</p>}

            <button type="submit" disabled={loading}>
              {loading ? 'Loading...' : 'Sign In'}
            </button>
            <Link href="/" style={{ marginTop: 10, fontSize: 13 }}>
              ← Back to Home
            </Link>
          </form>
        </div>

        {/* Overlay Animation */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>To keep connected with us please login with your personal info</p>
              <button className="ghost" id="signIn">Sign In</button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start your journey with us</p>
              <button className="ghost" id="signUp">Sign Up</button>
            </div>
          </div>
        </div>
      </div>

      <footer>
        <p>
          Created with <i className="fa fa-heart"></i> by{' '}
          <a target="_blank" href="https://florin-pop.com">kinay Pop</a>
        </p>
      </footer>

      {/* JS Animation */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            const signUpButton = document.getElementById('signUp');
            const signInButton = document.getElementById('signIn');
            const container = document.getElementById('container');
            signUpButton.addEventListener('click', () => {
              container.classList.add('right-panel-active');
            });
            signInButton.addEventListener('click', () => {
              container.classList.remove('right-panel-active');
            });
          `,
        }}
      />
    </>
  );
}
