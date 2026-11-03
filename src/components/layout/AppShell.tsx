import { Outlet, ScrollRestoration } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import './layout.css';

export function AppShell() {
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <Header />
      <main id="main"><div className="container page"><Outlet /></div></main>
      <Footer />
      <ScrollRestoration />
    </>
  );
}
