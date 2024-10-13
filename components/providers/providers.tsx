'use client';

import * as React from 'react';

import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';

import {ModalProvider} from '@/components/providers/modal-provider';
import {ThemeProvider} from '@/components/providers/theme-provider';
import {Toaster} from 'sonner';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

export default function Providers({children}: {children: React.ReactNode}) {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <Toaster />
        <ModalProvider />
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
