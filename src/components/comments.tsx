'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export function Comments() {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!ref.current) return;

    // Clear previous utterances
    ref.current.innerHTML = '';
    const script = document.createElement('script');
    script.src = 'https://utteranc.es/client.js';
    script.setAttribute('repo', 'milyas26/supri-spinach-stock-research');
    script.setAttribute('issue-term', 'pathname');
    script.setAttribute('theme', 'boxy-light');
    script.setAttribute('label', 'req dong bang');
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;
    

    ref.current.appendChild(script);

    return () => {
      if (ref.current) {
        ref.current.innerHTML = '';
      }
    };
  }, [pathname]);

  return <div ref={ref} className="mt-8" />;
}
