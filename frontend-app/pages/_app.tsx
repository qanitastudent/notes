// pages/_app.tsx
import '../styles/globals.css';

import type { AppProps } from 'next/app';
import "@fortawesome/fontawesome-free/css/all.min.css";
import '../styles/auth.css';
import '@/styles/auth.css';


export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
