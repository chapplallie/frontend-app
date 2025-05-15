import React from 'react';
import { useNavigate } from 'react-router-dom';

interface NavButtonProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const NavButton: React.FC<NavButtonProps> = ({ to, children, className = '', onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(to);
    }
  };

  return (
    <button className={`nav-button ${className}`} onClick={handleClick}>
      {children}
    </button>
  );
};

export default NavButton;
