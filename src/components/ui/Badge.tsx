import React, { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  color?: string;
  bg?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, color = '#3b82f6', bg = 'rgba(59, 130, 246, 0.15)' }) => {
  return (
    <span className="task-badge" style={{ color, backgroundColor: bg }}>
      {children}
    </span>
  );
};

export default Badge;
