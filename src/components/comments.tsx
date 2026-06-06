'use client';

import { useEffect, useRef } from 'react';

export function Comments() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || ref.current.querySelector('.utterances')) return;

    const script = document.createElement('script');
    script.src = 'https://utteranc.es/client.js';
    script.setAttribute('repo', 'milyas26/supri-spinach-stock-research');
    script.setAttribute('issue-term', 'url');
    script.setAttribute('theme', 'gruvbox-dark');
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;

    ref.current.appendChild(script);
  }, []);

  return <div ref={ref} className="mt-8" />;
}
