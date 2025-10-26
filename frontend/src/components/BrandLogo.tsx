type BrandLogoProps = {
  className?: string;
  size?: number;
};

const BrandLogo = ({ className, size = 32 }: BrandLogoProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <radialGradient id="veilcivic_mark_bg" cx="50%" cy="45%" r="70%">
        <stop offset="0%" stopColor="#8A5CF6" />
        <stop offset="55%" stopColor="#5C7CF8" />
        <stop offset="100%" stopColor="#1F3DFF" />
      </radialGradient>
      <linearGradient id="veilcivic_mark_v" x1="20%" y1="10%" x2="80%" y2="90%">
        <stop offset="0%" stopColor="#F6C1FF" />
        <stop offset="50%" stopColor="#91E7FF" />
        <stop offset="100%" stopColor="#3CFFDC" />
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="16" fill="url(#veilcivic_mark_bg)" />
    <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4">
      <path
        d="M16 16c10.5 20 21.5 41 26 49 4.5-8 16-29.5 26-49"
        stroke="url(#veilcivic_mark_v)"
      />
      <path
        d="M48 42c-4.1 7-11.8 15-22 15-18.7 0-28-16.3-28-29 0-13 9.3-29 28-29 10.2 0 18 6.2 22 14.1"
        stroke="#FDFDFE"
        opacity=".72"
      />
    </g>
  </svg>
);

export default BrandLogo;
