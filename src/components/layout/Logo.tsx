/** Official UOB logo. Files live in /public/brand – swap for the latest approved assets there. */
export function Logo({ reversed = false, height = 30 }: { reversed?: boolean; height?: number }) {
  return <img src={reversed ? '/brand/uob-logo-white.svg' : '/brand/uob-logo.svg'} alt="UOB" style={{ height, display: 'block' }} />;
}

/** AI Hub wordmark with the (small) UOB logo beneath it. */
export function BrandMark({ reversed = false, size = 'md' }: { reversed?: boolean; size?: 'sm' | 'md' | 'lg' }) {
  const s = { sm: { t: 20, l: 11 }, md: { t: 24, l: 13 }, lg: { t: 44, l: 20 } }[size];
  return (
    <span className={`brandmark ${reversed ? 'reversed' : ''}`}>
      <span className="brandmark-title" style={{ fontSize: s.t }}>AI Hub</span>
      <Logo reversed={reversed} height={s.l} />
    </span>
  );
}
