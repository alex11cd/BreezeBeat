import React from 'react';
import ThemeProvider from './components/tasks/ThemeProvider';

export default function Layout({ children, currentPageName }) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}