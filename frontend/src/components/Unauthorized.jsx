import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Unauthorized() {
  return (
    <motion.div
      className="flex-center flex-1 flex-col"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <h1 className="h1 text-red-600">Unauthorized</h1>
      <p className="mb-4">You do not have permission to view this page.</p>
      <Link to="/" className="btn btn-primary">Go Home</Link>
    </motion.div>
  );
}