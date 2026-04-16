import { Suspense, ReactNode } from 'react'

export default function BusinessesLayout({
  children,
}: {
  children: ReactNode
}) {
  return <Suspense fallback={null}>{children}</Suspense>
}