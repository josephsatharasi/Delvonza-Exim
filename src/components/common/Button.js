const Button = ({ children, variant = 'primary', onClick, className = '' }) => {
  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white',
    secondary: 'bg-white hover:bg-gray-100 text-primary-600',
    outline: 'border-2 border-white text-white hover:bg-white hover:text-primary-600'
  };

  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg transform hover:scale-105 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
