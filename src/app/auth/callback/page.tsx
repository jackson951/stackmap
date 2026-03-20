'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('stackmap_token', token);
      router.push('/dashboard');
    } else {
      router.push('/');
    }
  }, [router]);

  return <p>Logging you in...</p>;
}
