import React from 'react';
import ThemeRegistry from '@/components/ThemeRegistry';

export const metadata = {
  title: 'Fleet Management - Vehicle and Driver Management Platform',
  description: 'A comprehensive fleet management platform for tracking vehicles and drivers',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}