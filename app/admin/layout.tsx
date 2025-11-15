import React from 'react';

// This simple layout ensures the admin pages don't inherit all of the main
// site's specific fonts and global styles, providing a clean slate.
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // We use the main <html> and <body> from the root layout,
    // but this section allows us to apply a different background and style scope.
    <section className="bg-brand-brown-dark min-h-screen font-sans">
      {children}
    </section>
  )
}