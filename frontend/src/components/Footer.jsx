import React from 'react';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <motion.footer
      className="bg-surface border-t border-border py-6 mt-auto w-full"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-textSecondary text-sm">
        <div className="mb-2 md:mb-0">
          © {new Date().getFullYear()} Tickify. All rights reserved.
        </div>
        <div className="flex space-x-4">
          <a href="/" className="hover:text-primary transition-colors">Home</a>
          <a href="/about" className="hover:text-primary transition-colors">About</a>
          <a href="/contact" className="hover:text-primary transition-colors">Contact</a>
        </div>
      </div>
    </motion.footer>
  );
} 