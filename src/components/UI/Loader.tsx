import React from 'react';

type LoaderProps = {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  text?: string;
};

const Loader: React.FC<LoaderProps> = ({ 
  size = 'md', 
  color = 'primary', 
  text 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
  };
  
  const colorClasses = {
    primary: 'border-primary-500',
    secondary: 'border-secondary-500',
    accent: 'border-accent-500',
    white: 'border-white',
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div 
        className={`
          ${sizeClasses[size]} 
          ${colorClasses[color as keyof typeof colorClasses] || colorClasses.primary} 
          rounded-full border-t-transparent animate-spin
        `}
      />
      {text && (
        <p className="mt-2 text-sm text-neutral-600">{text}</p>
      )}
    </div>
  );
};

export default Loader;