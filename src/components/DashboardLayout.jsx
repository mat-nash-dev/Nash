import React from 'react';
import Footer from './Footer';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 pt-24 pb-12">
        {children}
      </main>
      <Footer />
    </div>
  );
}
