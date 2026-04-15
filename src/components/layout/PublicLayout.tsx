import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { PublicFooter } from './PublicFooter';

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}
