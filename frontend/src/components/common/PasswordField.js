import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const PasswordField = ({
  value,
  onChange,
  placeholder = 'Password',
  minLength,
  required,
  className = '',
  name = 'password',
  autoComplete = 'current-password'
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <input
        name={name}
        type={visible ? 'text' : 'password'}
        placeholder={placeholder}
        minLength={minLength}
        value={value}
        onChange={onChange}
        required={required}
        autoComplete={autoComplete}
        className="w-full border border-gray-300 rounded-lg pl-4 pr-11 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-gray-500 hover:text-primary-600 hover:bg-gray-100"
        aria-label={visible ? 'Hide password' : 'Show password'}
        tabIndex={-1}
      >
        {visible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </button>
    </div>
  );
};

export default PasswordField;
