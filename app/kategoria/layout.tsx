// app/kategoria/layout.tsx
import { Suspense } from 'react'
import type { ReactNode } from 'react'

export default function CategoryLayout({ children }: { children: ReactNode }) {
  return <Suspense fallback={null}>{children}</Suspense>
}