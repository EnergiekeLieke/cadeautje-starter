import type { IcoonNaam } from '@/lib/config';

// Alle icoontjes tekenen met currentColor: lijnen voor de contour, een zachte vulling (opacity .22) voor de body
// en volle vlakjes voor de accenten. Zo blijven ze ook op kleine tegels goed leesbaar.
const VUL = { fill: 'currentColor', fillOpacity: 0.22 } as const;

const ICONEN: Record<IcoonNaam, React.ReactNode> = {
  cadeau: (
    <g>
      <rect x="4.5" y="10.5" width="15" height="10" rx="1" {...VUL} />
      <rect x="3.5" y="7.5" width="17" height="3" rx="1" {...VUL} />
      <path d="M12 7.5v13" strokeWidth="2.6" />
      <path d="M12 7.5C10.5 3.5 6.5 4 8 6.8c.7 1.2 2.5 1 4 .7zM12 7.5c1.5-4 5.5-3.5 4-.7-.7 1.2-2.5 1-4 .7z" />
    </g>
  ),
  ster: <path d="M12 2.8l2.8 5.9 6.4.9-4.7 4.5 1.2 6.4L12 17.3l-5.7 3.2 1.2-6.4-4.7-4.5 6.4-.9z" fill="currentColor" />,
  hart: <path d="M12 20.5s-8.2-5-8.2-10.8A4.6 4.6 0 0 1 12 6.8a4.6 4.6 0 0 1 8.2 2.9C20.2 15.5 12 20.5 12 20.5z" fill="currentColor" />,
  ei: (
    <g>
      <path d="M12 2.5c-3.6 0-6.5 5.6-6.5 10.2a6.5 6.5 0 0 0 13 0C18.5 8.100 15.600 2.500 12 2.500z" {...VUL} />
      <path d="M5.700 12.500c1.500-1.200 2.800-1.200 4.200 0s2.800 1.200 4.200 0 2.800-1.200 4.200 0" />
      <path d="M6.600 16.500c1.300-1 2.500-1 3.800 0s2.500 1 3.800 0 2.500-1 3.800 0" />
      <circle cx="12" cy="8" r="1.100" fill="currentColor" stroke="none" />
    </g>
  ),
  koffer: (
    <g>
      <rect x="3.5" y="8" width="17" height="11.5" rx="2" {...VUL} />
      <path d="M9 8V5.500a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1V8" />
      <path d="M8 8v11.500M16 8v11.500" />
      <path d="M6 19.500v1.500M18 19.500v1.500" />
    </g>
  ),
  ballon: (
    <g>
      <path d="M12 2.800c-3.300 0-5.800 2.600-5.800 6 0 3.600 2.800 6.500 5.800 8 3-1.500 5.800-4.400 5.800-8 0-3.400-2.500-6-5.800-6z" {...VUL} />
      <path d="M11 17.300l1 1.300 1-1.300z" fill="currentColor" />
      <path d="M12 18.600c-1.500 1-1.500 2 0 2.900" />
      <path d="M9 6.300c.6-.9 1.500-1.400 2.500-1.500" />
    </g>
  ),
  taart: (
    <g>
      <rect x="4" y="12" width="16" height="8" rx="1.500" {...VUL} />
      <path d="M4 15.500c2 1.500 3 1.500 4 0s3-1.500 4 0 3 1.500 4 0 3-.5 4 0" />
      <path d="M9 12V9.500M12 12V9.500M15 12V9.500" />
      <path d="M9 6c1 1.200 1 2 0 2.800C8 8 8 7.200 9 6zM12 6c1 1.200 1 2 0 2.800C11 8 11 7.200 12 6zM15 6c1 1.200 1 2 0 2.800C14 8 14 7.200 15 6z" fill="currentColor" stroke="none" />
    </g>
  ),
  pompoen: (
    <g>
      <path d="M12 7.500c-5 0-8.500 3-8.500 6.500 0 3.300 3.200 6 8.500 6s8.500-2.700 8.500-6c0-3.500-3.500-6.500-8.500-6.500z" {...VUL} />
      <path d="M12 7.500c-2.500 2.500-2.500 9.500 0 12.500M12 7.500c2.500 2.500 2.500 9.500 0 12.500" />
      <path d="M12 7.500V4.500c0-1 .8-1.500 2-1.500" />
    </g>
  ),
  zon: (
    <g>
      <circle cx="12" cy="12" r="4.200" {...VUL} />
      <path d="M12 2.500v3M12 18.500v3M2.500 12h3M18.500 12h3M5.300 5.300l2.100 2.100M16.600 16.600l2.100 2.100M5.300 18.700l2.100-2.100M16.600 7.400l2.100-2.100" />
    </g>
  ),
  bloem: (
    <g>
      <circle cx="12" cy="7" r="2.900" {...VUL} />
      <circle cx="17" cy="11" r="2.900" {...VUL} />
      <circle cx="15" cy="16.500" r="2.900" {...VUL} />
      <circle cx="9" cy="16.500" r="2.900" {...VUL} />
      <circle cx="7" cy="11" r="2.900" {...VUL} />
      <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
    </g>
  ),
  boom: (
    <g>
      <path d="M12 2.5l4.500 6h-2.500l4 5.500h-3l3.500 5H5.500l3.500-5H6l4-5.500H7.500z" {...VUL} />
      <rect x="10.500" y="19.500" width="3" height="2.500" fill="currentColor" stroke="none" />
    </g>
  ),
  sneeuwvlok: (
    <g>
      {[0, 60, 120].map((hoek) => (
        <g key={hoek} transform={`rotate(${hoek} 12 12)`}>
          <path d="M12 2.500v19M9.600 4.700L12 7.200l2.400-2.500M9.600 19.300L12 16.800l2.400 2.500" />
        </g>
      ))}
    </g>
  ),
  blad: (
    <g>
      <path d="M12 3C6 5 4.500 11 6 15c1.200 3 4.200 5 6 6 1.800-1 4.800-3 6-6 1.500-4 0-10-6-12z" {...VUL} />
      <path d="M12 21V8M12 12l-3-2M12 15l3-2" />
    </g>
  ),
  schoen: (
    <g>
      <path d="M8 4h6v7.500c0 1 .6 1.500 1.700 1.900 2.700.9 4.300 2 4.300 4.100v.5H6.500c-.8 0-1.500-.7-1.500-1.500V9.500c0-1 .5-1.700 1.200-2L8 6.500z" {...VUL} />
      <path d="M8 6.500h6M5 17.500h15" />
    </g>
  ),
};

export default function CadeauIcoon({ naam, className }: { naam: IcoonNaam; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      {ICONEN[naam]}
    </svg>
  );
}
