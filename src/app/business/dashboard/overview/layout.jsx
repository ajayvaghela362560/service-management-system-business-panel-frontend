import React from 'react';
import PageContainer from '@/components/layout/page-container';

export default function OverViewLayout({ children }) {
  return (
    <PageContainer>
      {children}
    </PageContainer>
  );
}
