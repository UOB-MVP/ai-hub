/** Official UOB logo. Files live in /public/brand – swap for the latest approved assets there. */
export function Logo({ reversed = false, height = 30 }: { reversed?: boolean; height?: number }) {
  return <img src={reversed ? '/brand/uob-logo-white.svg' : '/brand/uob-logo.svg'} alt="UOB" style={{ height, display: 'block' }} />;
}
