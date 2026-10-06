import React from 'react';

interface ProgressBarProps {
  percentage: number;
  color?: string;
  height?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  color = '#ff6b35',
  height = 8,
}) => {
  return (
    <div className="subject-bar-track" style={{ height: `${height}px` }}>
      <div
        className="subject-bar-fill"
        style={{
          width: `${Math.min(100, Math.max(0, percentage))}%`,
          backgroundColor: color,
        }}
      />
    </div>
  );
};

export default ProgressBar;
