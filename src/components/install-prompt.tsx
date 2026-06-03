'use client';

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosHint, setShowIosHint] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Don't show if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) return;
    if ((navigator as Navigator & { standalone?: boolean }).standalone === true) return;

    // Check dismissed state
    if (localStorage.getItem('pwa-install-dismissed')) return;

    // Android: listen for beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);

    // iOS detection
    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const isSafari = /safari/i.test(navigator.userAgent) && !/crios|fxios|opios|mercury/i.test(navigator.userAgent);
    if (isIos && isSafari) {
      setShowIosHint(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('pwa-install-dismissed', '1');
    setDismissed(true);
    setDeferredPrompt(null);
    setShowIosHint(false);
  };

  if (dismissed) return null;

  // Android prompt
  if (deferredPrompt) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 flex items-center justify-between gap-3 rounded-xl border border-green-700/40 bg-zinc-900/95 px-4 py-3 shadow-xl backdrop-blur-sm md:left-auto md:right-6 md:max-w-sm">
        <div className="flex items-center gap-3 min-w-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon-192.png" alt="icon" className="h-9 w-9 rounded-lg flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white leading-tight">Install Mr. Supri</p>
            <p className="text-xs text-zinc-400 leading-tight">Add to home screen</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleInstall}
            className="rounded-lg bg-green-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-600 transition-colors"
          >
            Install
          </button>
          <button
            onClick={handleDismiss}
            className="rounded-lg px-2 py-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      </div>
    );
  }

  // iOS hint
  if (showIosHint) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 rounded-xl border border-green-700/40 bg-zinc-900/95 px-4 py-3 shadow-xl backdrop-blur-sm md:left-auto md:right-6 md:max-w-sm">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icon-192.png" alt="icon" className="h-9 w-9 rounded-lg flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-white leading-tight mb-1">Install Mr. Supri</p>
              <p className="text-xs text-zinc-400 leading-snug">
                Tap{' '}
                <span className="inline-block text-white font-bold">⎙</span>
                {' '}then <span className="text-white font-semibold">"Add to Home Screen"</span>
              </p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-xs text-zinc-400 hover:text-white transition-colors flex-shrink-0"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      </div>
    );
  }

  return null;
}
