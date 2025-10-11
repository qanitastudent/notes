import '@/styles/globals.css';
import '@/styles/auth.css'; // kalau mau global juga untuk style auth
import type { AppProps } from 'next/app';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        {/* Import font Chewy untuk semua halaman */}
        <link
          href="https://fonts.googleapis.com/css2?family=Chewy&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* Neon Shadow SVG Filter */}
      <svg width="0" height="0" aria-hidden="true" style={{ position: 'fixed' }}>
        <filter
          id="shadow"
          x="-1"
          y="-1"
          width="3"
          height="3"
          colorInterpolationFilters="sRGB"
          primitiveUnits="objectBoundingBox"
        >
          <feGaussianBlur stdDeviation="0.1" />
          <feOffset dx="0.1" dy="0.1" result="in" />
          <feTurbulence type="fractalNoise" baseFrequency="0.9713" />
          <feDisplacementMap in="in" scale="0.2" yChannelSelector="R" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.9" />
          </feComponentTransfer>
          <feBlend in="SourceGraphic" />
        </filter>
      </svg>

      <Component {...pageProps} />
    </>
  );
}
