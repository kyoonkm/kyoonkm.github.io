'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/publications', label: 'Publications' },
  { href: '/projects', label: 'Projects' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="rn-head">
      {/* Every visit began by tabbing the whole header. */}
      <a href="#main" className="rn-skip">
        Skip to content
      </a>

      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* The wordmark, not an empty slot: this link used to ship with no
              accessible name as the first tab stop on every page, and past the
              hero the name appeared nowhere on screen. */}
          <Link href="/" className="rn-mark">
            Kayoon Kim
          </Link>

          <nav className="rn-nav hidden md:flex" aria-label="Primary">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                /* Nothing announced which page you were on: the nav styled all
                   four items identically and carried no aria-current. */
                aria-current={pathname === item.href ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
            <a href="/CV_KayoonKim.pdf" target="_blank" rel="noopener noreferrer">
              CV (PDF)
            </a>
          </nav>

          <button
            className="rn-burger md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <i className={`ri-${isMenuOpen ? 'close' : 'menu'}-line`} aria-hidden="true"></i>
          </button>
        </div>

        {isMenuOpen && (
          <nav className="rn-nav rn-nav-m md:hidden" aria-label="Primary">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? 'page' : undefined}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <a href="/CV_KayoonKim.pdf" target="_blank" rel="noopener noreferrer">
              CV (PDF)
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}
