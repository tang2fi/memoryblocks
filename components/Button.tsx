import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyle = "font-bold rounded-2xl transition-all active:scale-95 shadow-md flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-blue-500 text-white hover:bg-blue-600 shadow-blue-200",
    secondary: "bg-amber-400 text-white hover:bg-amber-500 shadow-amber-200",
    danger: "bg-red-500 text-white hover:bg-red-600 shadow-red-200",
    success: "bg-green-500 text-white hover:bg-green-600 shadow-green-200",
    outline: "bg-white text-gray-700 border-2 border-gray-200 hover:bg-gray-50",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-xl",
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
