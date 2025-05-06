import React, { ReactNode } from 'react';

type CardProps = {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  footer?: ReactNode;
  noPadding?: boolean;
  hoverable?: boolean;
};

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  title, 
  subtitle, 
  footer,
  noPadding = false,
  hoverable = false,
}) => {
  return (
    <div 
      className={`
        bg-white rounded-xl shadow-sm border border-neutral-200
        overflow-hidden transition-all
        ${hoverable ? 'hover:shadow-md hover:translate-y-[-2px]' : ''} 
        ${className}
      `}
    >
      {(title || subtitle) && (
        <div className="px-5 pt-4 pb-2">
          {title && <h3 className="text-lg font-semibold text-neutral-800">{title}</h3>}
          {subtitle && <p className="text-sm text-neutral-500 mt-1">{subtitle}</p>}
        </div>
      )}
      
      <div className={noPadding ? '' : 'p-5 pt-3'}>
        {children}
      </div>
      
      {footer && (
        <div className="px-5 py-3 bg-neutral-50 border-t border-neutral-200">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;