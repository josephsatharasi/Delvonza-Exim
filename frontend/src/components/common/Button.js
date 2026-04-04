const Button = ({
  children,
  variant = 'primary',
  onClick,
  className = '',
  disabled = false,
  type = 'button',
  title,
  ...rest
}) => {
  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white',
    secondary: 'bg-white hover:bg-gray-100 text-primary-600',
    outline: 'border-2 border-white text-white hover:bg-white hover:text-primary-600'
  };

  const disabledCls = disabled ? 'opacity-50 cursor-not-allowed pointer-events-none shadow-none hover:scale-100' : '';

  return (
    <button
      type={type}
      title={title}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      className={`px-6 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg transform hover:scale-105 ${variants[variant]} ${disabledCls} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
