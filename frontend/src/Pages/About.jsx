import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function About() {
  useEffect(() => {
    AOS.init({ duration: 700, once: true });
  }, []);
  return (
    <div className="flex-center min-h-screen bg-background px-4">
      <div className="bg-surface rounded-xl shadow-lg p-8 w-full max-w-2xl border border-border" data-aos="fade-up">
        <h1 className="h1 mb-6 text-center">About Tickify</h1>
        <p className="mb-8 text-textSecondary text-lg text-center">
          Tickify is a modern online event ticketing system built for seamless event discovery, booking, and management. Our mission is to empower users, organizers, and admins with a secure, accessible, and delightful experience.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="h2 mb-2 text-center md:text-left">Our Team</h2>
            <ul className="space-y-2 text-textSecondary text-center md:text-left">
              <li>Loai Farrag</li>
              <li>Hassan Eslam</li>
              <li>Ahmed Megahed</li>
              <li>Farah Selim</li>
              <li>Malak Oraby</li>
            </ul>
          </div>
          <div>
            <h2 className="h2 mb-2 text-center md:text-left">Faculty & Supervision</h2>
            <ul className="space-y-2 text-textSecondary text-center md:text-left">
              <li>Dr. John Zaki (Faculty of Informatics and Computer Science, GIU)</li>
            </ul>
          </div>
        </div>
        <h2 className="h2 mb-2 text-center">Our Mission</h2>
        <p className="text-textSecondary text-center">
          To provide a robust, user-friendly platform for event management and ticketing, ensuring accessibility, security, and a great user experience for all roles.
        </p>
      </div>
    </div>
  );
} 