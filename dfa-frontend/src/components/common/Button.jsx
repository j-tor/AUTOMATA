import React from 'react';

/**
 * Reusable Premium Button Component
 */
export const Button = ({
  label,
  onClick,
  variant = 'primary',
  disabled = false,
  loading = false,
  type = 'button',
  icon: Icon = null,
  className = ''
}) => {
  // Base classes defined in index.css
  let btnClass = 'glass-button-primary';
  if (variant === 'secondary') btnClass = 'glass-button-secondary';
  if (variant === 'danger') btnClass = 'glass-button-danger';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 select-none active:scale-[0.98] transition-transform duration-100 ${btnClass} ${className}`}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {!loading && Icon && <Icon size={18} className="shrink-0" />}
      <span>{label}</span>
    </button>
  );
};

export default Button;
