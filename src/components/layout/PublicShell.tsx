'use client';

import { Header } from './Header';

interface PublicShellProps {
  children: React.ReactNode;
}

const PublicShell = ({ children }: PublicShellProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      <Header isPublic={true} />
      <main>{children}</main>
    </div>
  );
};

export { PublicShell };
