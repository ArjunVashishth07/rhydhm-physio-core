import React, { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Reusable Accessible BaseModal Component
 * Supports glassmorphism blur, ESC key dismiss, outside click, and custom sizing.
 */
export const BaseModal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon: Icon,
  children,
  size = 'lg',
  headerClass = 'clinical-modal-header',
  showCloseBtn = true
}) => {
  // ESC key listener
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClass =
    size === 'sm'
      ? 'modal-sm'
      : size === 'md'
      ? ''
      : size === 'xl'
      ? 'modal-xl'
      : 'modal-lg';

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
      style={{
        backgroundColor: 'rgba(15, 12, 10, 0.72)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        zIndex: 1055
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose?.();
        }
      }}
    >
      <div className={`modal-dialog ${maxWidthClass} modal-dialog-centered modal-dialog-scrollable`}>
        <div className="modal-content border-0 shadow-2xl rounded-4 overflow-hidden text-start">
          {/* Header */}
          {(title || showCloseBtn) && (
            <div
              className={`modal-header border-0 text-white p-4 d-flex align-items-center justify-content-between ${headerClass}`}
              style={{
                background:
                  headerClass === 'clinical-modal-header'
                    ? 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)'
                    : undefined
              }}
            >
              <div className="d-flex align-items-center gap-3">
                {Icon && (
                  <div className="p-2.5 rounded-circle bg-white text-teal d-flex align-items-center justify-content-center shadow-xs flex-shrink-0">
                    <Icon size={22} />
                  </div>
                )}
                <div>
                  {title && <h4 className="fw-bold mb-0 text-white">{title}</h4>}
                  {subtitle && <small className="text-white-50 d-block mt-0.5">{subtitle}</small>}
                </div>
              </div>
              {showCloseBtn && (
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={onClose}
                  aria-label="Close"
                ></button>
              )}
            </div>
          )}

          {/* Body */}
          <div className="modal-body p-4 bg-body">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default BaseModal;
