import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'

import HomePage from '@/pages/HomePage'
import '@/styles/globals.css'

/**
 * App.jsx — application root.
 *
 * Responsibilities (and ONLY these):
 *   1. Provide the React Query client to the whole tree
 *   2. Mount the global toast notification layer
 *   3. Render the top-level page(s)
 *
 * All page-level composition (sections, layout) lives in:
 *   → src/pages/HomePage.jsx
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 60_000,
      throwOnError: false, // use fallback content on error instead of crashing
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: 'var(--green)',
            color: '#fff',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '14px',
            borderRadius: '100px',
            padding: '12px 22px',
          },
          success: { iconTheme: { primary: '#C9A84C', secondary: '#fff' } },
        }}
      />
      <HomePage />
    </QueryClientProvider>
  )
}


