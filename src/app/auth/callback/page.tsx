'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CallbackPage() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const token = params.get('token');

    if (token) {
      localStorage.setItem('stackmap_token', token);
      router.push('/dashboard');
    } else {
      router.push('/');
    }
  }, [params, router]);

  return <p>Logging you in...</p>;
}