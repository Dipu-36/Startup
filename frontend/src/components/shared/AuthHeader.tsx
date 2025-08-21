import React from 'react';
import '../../styles/shared/AuthHeader.css';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="auth-header">
      <div className="auth-header-content">
        <h1 className="font-display">{title}</h1>
        <p className="font-body">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthHeader;
