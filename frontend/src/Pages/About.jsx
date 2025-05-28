import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function About() {
  useEffect(() => {
    AOS.init({ duration: 700, once: true });
  }, []);
  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-background px-4">
      <div className="bg-surface rounded-xl shadow-lg p-10 w-full max-w-3xl border border-border flex flex-col items-center" data-aos="fade-up">
        <h1 className="h1 mb-6 text-center">About Tickify</h1>
        <p className="mb-8 text-textSecondary text-lg text-center max-w-2xl">
          Tickify is a modern online event ticketing system built for seamless event discovery, booking, and management. Our mission is to empower users, organizers, and admins with a secure, accessible, and delightful experience.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 w-full">
          <div>
            <h2 className="h2 mb-2 text-center">Our Team</h2>
            <ul className="space-y-2 text-textSecondary text-center">
              <li>Loai Farrag</li>
              <li>Hassan Eslam</li>
              <li>Ahmed Megahed</li>
              <li>Farah Selim</li>
              <li>Malak Oraby</li>
            </ul>
          </div>
          <div>
            <h2 className="h2 mb-2 text-center">Faculty & Supervision</h2>
            <ul className="space-y-2 text-textSecondary text-center">
              <li>Dr. John Zaki (Faculty of Informatics and Computer Science, GIU)</li>
            </ul>
          </div>
        </div>
        <h2 className="h2 mb-2 text-center">Our Mission</h2>
        <p className="text-textSecondary text-center max-w-2xl">
          To provide a robust, user-friendly platform for event management and ticketing, ensuring accessibility, security, and a great user experience for all roles.
        </p>
      </div>
    </div>
  );
} 