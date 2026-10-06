import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';
import '../../styles/dashboard.css';

interface DashboardLayoutProps {
  children: ReactNode;
  currentPath?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  currentPath = '/',
}) => {
  return (
    <div className="study-layout">
      <Sidebar currentPath={currentPath} />
      <div className="study-main-wrapper">
        <main className="study-main-content">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
