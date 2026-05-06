import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="fr">
      <Head />
      <body className="antialiased bg-neutral-50">
        {/* Filtre de bruit SVG global pour l'effet "Cinématique" - donne de la texture */}
        <svg
          className="pointer-events-none fixed inset-0 z-[9999] opacity-[0.035] mix-blend-overlay w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <filter id="noiseFilter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="3"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
        
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
