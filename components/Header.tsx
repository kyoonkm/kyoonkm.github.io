'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 w-full bg-backgroundCream/95 backdrop-blur-sm z-50 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* The wordmark, not an empty slot: this link used to ship with no
              accessible name as the first tab stop on every page, and past the
              hero the name appeared nowhere on screen. */}
          <Link href="/" className="rn-mark">
            Kayoon Kim
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-textGrayCustom hover:text-gray-600 transition-colors font-medium">
              Home
            </Link>
            <Link href="/publications" className="text-textGrayCustom hover:text-gray-600 transition-colors font-medium">
              Publications
            </Link>
            <Link href="/projects" className="text-textGrayCustom hover:text-gray-600 transition-colors font-medium">
              Projects
            </Link>
            <a href="/CV_Kayoon_Kim.pdf" target="_blank" rel="noopener noreferrer" className="text-textGrayCustom hover:text-gray-600 transition-colors font-medium">
              CV
            </a>
          </nav>

          <button
            className="md:hidden p-2 cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <i className={`ri-${isMenuOpen ? 'close' : 'menu'}-line text-textGrayCustom`}></i>
          </button>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden mt-2 pb-4 pt-2">
            <div className="flex flex-col space-y-3">
              <Link href="/" className="text-gray-700 hover:text-textGrayCustom transition-colors cursor-pointer">
                Home
              </Link>
              <Link href="/publications" className="text-gray-700 hover:text-textGrayCustom transition-colors cursor-pointer">
                Publications
              </Link>
              <Link href="/projects" className="text-gray-700 hover:text-textGrayCustom transition-colors cursor-pointer">
                Projects
              </Link>
              <a href="/CV_Kayoon_Kim.pdf" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-textGrayCustom transition-colors cursor-pointer">
                CV
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
