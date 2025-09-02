import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, LineChart, Wallet } from 'lucide-react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r p-4 flex flex-col">
        <h1 className="text-2xl font-bold mb-8">Financier AI</h1>
        <nav className="flex flex-col space-y-2">
          <NavLink to="/" className={({ isActive }) => `flex items-center space-x-2 rounded-md p-2 ${isActive ? 'bg-secondary' : ''}`}>
            <Home className="h-5 w-5" />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/transactions" className={({ isActive }) => `flex items-center space-x-2 rounded-md p-2 ${isActive ? 'bg-secondary' : ''}`}>
            <Wallet className="h-5 w-5" />
            <span>Transactions</span>
          </NavLink>
          <NavLink to="/accounts" className={({ isActive }) => `flex items-center space-x-2 rounded-md p-2 ${isActive ? 'bg-secondary' : ''}`}>
            <LineChart className="h-5 w-5" />
            <span>Accounts</span>
          </NavLink>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
