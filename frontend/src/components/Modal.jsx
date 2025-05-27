// src/components/Modal.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Modal({ isOpen, onClose, onConfirm, title, message, children }) {
  const modalRef = React.useRef();

  React.useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-20 overflow-y-auto"
          aria-modal="true"
          role="dialog"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex items-center justify-center min-h-screen px-4 text-center">
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-30 transition-opacity"
              onClick={onClose}
              aria-label="Close modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            {/* Modal */}
            <motion.div
              ref={modalRef}
              tabIndex={-1}
              className="inline-block w-full max-w-lg p-8 my-8 overflow-hidden text-left align-middle transition-all transform bg-surface rounded-2xl shadow-2xl focus:outline-none"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              {title && (
                <h3 className="text-xl font-bold leading-6 text-text mb-4">
                  {title}
                </h3>
              )}
              <div className="mt-2 text-textSecondary">
                {children ? (
                  typeof children === 'string' || typeof children === 'number'
                    ? children
                    : React.isValidElement(children)
                      ? children
                      : children != null
                        ? JSON.stringify(children)
                        : null
                ) : (
                  <>
                    {message && <div className="mb-6">{message}</div>}
                    {onConfirm && (
                      <div className="flex justify-end gap-3 mt-6">
                        <button
                          className="btn btn-secondary"
                          onClick={onClose}
                          type="button"
                        >
                          Cancel
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={onConfirm}
                          type="button"
                        >
                          Confirm
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
