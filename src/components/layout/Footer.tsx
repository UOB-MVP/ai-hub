import { BrandMark } from './Logo';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <BrandMark reversed />
        <p>Use AI responsibly. Do not enter customer-identifiable or confidential data into any tool that is not approved on this hub. Outputs must be reviewed before use.</p>
        <p className="small">© {new Date().getFullYear()} United Overseas Bank Limited. For internal use only.</p>
      </div>
    </footer>
  );
}
