'use client';
import Header from '../../components/Header';
import AboutHero from './AboutHero';
import Education from './Education';
import Skills from './Skills';

export default function About() {
  return (
    <div className="min-h-screen">
      <Header />
      <AboutHero />
      <Education />
      <Skills />
    </div>
  );
}