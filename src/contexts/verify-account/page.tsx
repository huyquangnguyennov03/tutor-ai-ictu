// src/contexts/verify-account/page.tsx
import { Suspense } from 'react'
import VerifyAccount from '@/pages/VerifyAccount/VerifyAccount'

export default function Page() {
  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <VerifyAccount />
    </Suspense>
  )
}
