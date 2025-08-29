'use client';
import Header from '../../components/Header';
import AboutHero from './AboutHero';
import Skills from './Skills';

export default function About() {
  return (
    <div className="min-h-screen">
      <Header />
      <AboutHero />
      <Skills />
    </div>
  );
}