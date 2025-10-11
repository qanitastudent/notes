// pages/register.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { api } from '@/utils/api';
import Head from 'next/head';


export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await api.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      router.push('/login');
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const container = document.getElementById('container');
    const signInButton = document.getElementById('signIn');
    const signUpButton = document.getElementById('signUp');

    signInButton?.addEventListener('click', () => {
      router.push('/login');
    });

    signUpButton?.addEventListener('click', () => {
      container?.classList.add('right-panel-active');
    });
  }, [router]);

  return (
    <>
      <Head>
        <title>Register</title>
      </Head>

<div className="auth-page">
  <div className="container" id="container">
    {/* Form Register */}
    <div className="form-container sign-up-container">
      <form onSubmit={handleSubmit}>
        <h1>Create Account</h1>

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
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
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
        <input
          type="password"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={(e) =>
            setFormData({ ...formData, confirmPassword: e.target.value })
          }
          required
        />

        {error && <p className="error">{error}</p>}

        <button type="submit">{loading ? 'Loading...' : 'Sign Up'}</button>
      </form>
    </div>

    {/* Overlay */}
    <div className="overlay-container">
      <div className="overlay">
        <div className="overlay-panel overlay-left">
          <h1>Welcome Back!</h1>
          <p>Login with your personal info</p>
          <button className="ghost" id="signIn">Sign In</button>
        </div>
        <div className="overlay-panel overlay-right">
          <h1>Hello, Friend!</h1>
          <p>Have you created an account?</p>
          <button className="ghost ghost-register" onClick={() => router.push('/login')}>Sign In</button>
        </div>
      </div>
    </div>
  </div>
</div>


      <footer>
        <p>
          Created with <i className="fa fa-heart"></i> by{' '}
          <a target="_blank" href="https://florin-pop.com">Florin Pop</a>
        </p>
      </footer>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css?family=Montserrat:400,800');

        * { box-sizing: border-box; margin:0; padding:0; }
        body { font-family: 'Montserrat', sans-serif; }

        .container {
          background: transparent;
          border-radius: 10px;
          box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
          position: relative;
          overflow: hidden;
          width: 768px;
          max-width: 100%;
          min-height: 480px;
        }

        .form-container {
          position: absolute;
          top: 0;
          height: 100%;
          transition: all 0.6s ease-in-out;
        }

        .sign-up-container {
          left: 0;
          width: 50%;
          z-index: 2;
        }

        form {
          background-color: #fff;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 0 20px;
          height: 100%;
          text-align: center;
          margin: 0;
        }

        form h1 { font-weight: bold; margin-bottom: 20px; }
        form input {
          background-color: #eee;
          border: none;
          padding: 12px 15px;
          margin: 5px 0;
          width: 100%;
          border-radius: 5px;
          transition: all 0.3s ease;
        }
        form input:focus {
          outline: none;
          background-color: #fff;
          box-shadow: 0 4px 15px rgba(255, 75, 43, 0.4);
          transform: translateY(-2px);
          border: 1px solid #5a189a;
        }
        form button {
          border-radius: 20px;
          border: 1px solid #5a189a;
          background-color: #5a189a;
          color: #fff;
          font-weight: bold;
          padding: 12px 45px;
          margin-top: 5px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        form button:hover { transform: translateY(-2px); }
        .social-container {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: 8px;
        }
        .social-container a {
          border: 1px solid #ddd;
          color: #010101;
          background: none;
          text-decoration: none;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          height: 40px;
          width: 40px;
          border-radius: 50%;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .social-container a:hover { transform: translateY(-5px); box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
        .social-container a:active { transform: translateY(-2px); box-shadow: 0 2px 6px rgba(0,0,0,0.2); }

        .ghost-register {
          margin-top: 20px;
          border: 2px solid #fff;
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          font-size: 14px;
          font-weight: bold;
          padding: 12px 45px;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .ghost-register:hover { background: rgba(255,255,255,0.3); transform: translateY(-2px); box-shadow:0 4px 12px rgba(0,0,0,0.2);}
        .ghost-register:active { transform: translateY(0); box-shadow:none; }

        .overlay-container {
          position: absolute;
          top: 0;
          left: 50%;
          width: 50%;
          height: 100%;
          overflow: hidden;
          z-index: 100;
        }
        .overlay {
          background: linear-gradient(to right, #3c096c, #9d4edd);
          color: #fff;
          position: relative;
          left: -100%;
          height: 100%;
          width: 200%;
          transform: translateX(0);
          transition: transform 0.6s ease-in-out;
        }
        .overlay-panel {
          position: absolute;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 0 40px;
          text-align: center;
          top: 0;
          height: 100%;
          width: 50%;
        }
        .overlay-left { transform: translateX(-20%); }
        .overlay-right { right:0; transform: translateX(0); }
        .container.right-panel-active .overlay-left { transform: translateX(0); }
        .container.right-panel-active .overlay-right { transform: translateX(20%); }

        .error { color: red; font-size: 12px; margin-top: 5px; }
        footer { background-color: #222; color: #fff; font-size: 14px; bottom: 0; position: fixed; left: 0; right: 0; text-align: center; z-index: 999; }
        footer i { color: rgb(162, 113, 113); }
        footer a { color: #3c97bf; text-decoration: none; }

        @media (max-width: 768px) {
          .container { width: 90%; min-height: 420px; }
        }
      `}</style>
    </>
  );
}
