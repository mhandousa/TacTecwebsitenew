// At the top, add this helper
const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f6f7f8" offset="0%" />
      <stop stop-color="#edeef1" offset="20%" />
      <stop stop-color="#f6f7f8" offset="40%" />
      <stop stop-color="#f6f7f8" offset="100%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f6f7f8" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);

// Then replace your Image components:

// Hero Image
<Image
  src="/images/1_TacTec-Revolutionising-Football-Club-Management.webp"
  alt="TACTEC revolutionising football club management"
  width={1920}
  height={1080}
  priority
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1000px"
  quality={90}
  placeholder="blur"
  blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(1920, 1080))}`}
  className="rounded-lg shadow-2xl"
/>

// Challenge Image
<Image
  src="/images/2_The-Challenge-Fragmented-Football-Operations.webp"
  alt="Challenge – Fragmented football operations"
  width={1920}
  height={1080}
  loading="lazy"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1000px"
  quality={85}
  placeholder="blur"
  blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(1920, 1080))}`}
  className="rounded-lg shadow-lg"
/>
