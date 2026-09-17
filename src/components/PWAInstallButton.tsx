import React, { useState } from 'react';
import { Download, Smartphone, Check, X, Share } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'nav' | 'banner' | 'card';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'nav',
  className = '',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [dismissedBanner, setDismissedBanner] = useState(false);

  // If already installed as a standalone PWA on phone, don't show
  if (isInstalled) {
    return null;
  }

  // If user dismissed this banner session
  if (dismissedBanner && variant === 'banner') {
    return null;
  }

  if (variant === 'banner') {
    return (
      <>
        <div className={`bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white px-4 py-2.5 shadow-md border-b border-emerald-500/30 flex items-center justify-between gap-3 text-xs ${className}`}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/10 p-1 border border-white/20 flex items-center justify-center shrink-0">
              <img src="/icon.svg" alt="SahakarSeva" className="w-6 h-6 object-contain" />
            </div>
            <div>
              <div className="font-bold text-white flex items-center gap-2">
                <span>Install SahakarSeva Official App</span>
                <span className="bg-amber-400 text-amber-950 text-[9px] px-1.5 py-0.2 rounded font-extrabold uppercase tracking-wider">PWA App</span>
              </div>
              <p className="text-[11px] text-emerald-200/90 hidden sm:block">
                Install directly on your phone home screen — zero app store download needed, runs full-screen with offline support!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isInstallable ? (
              <button
                type="button"
                id="btn-install-pwa-banner"
                onClick={install}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install App</span>
              </button>
            ) : isIOS ? (
              <button
                type="button"
                id="btn-install-ios-banner"
                onClick={() => setShowIOSGuide(true)}
                className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-300" />
                <span>Install on iPhone</span>
              </button>
            ) : (
              <button
                type="button"
                id="btn-install-guide-banner"
                onClick={() => setShowIOSGuide(true)}
                className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Install on Mobile</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setDismissedBanner(true)}
              className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* iOS Guided Installation Modal */}
        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-700 p-1.5 flex items-center justify-center">
                    <img src="/icon.svg" alt="App Icon" className="w-6 h-6 object-contain" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">Install SahakarSeva</h3>
                    <p className="text-[11px] text-slate-500">Apple iPhone & iPad Safari</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-700 my-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0 text-xs">
                    1
                  </div>
                  <p>
                    Tap the <strong>Share</strong> button <Share className="w-3.5 h-3.5 inline mx-0.5 text-blue-600" /> in Safari navigation toolbar at the bottom of your screen.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0 text-xs">
                    2
                  </div>
                  <p>
                    Scroll down and select <strong>"Add to Home Screen"</strong> with the <span className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200">➕</span> icon.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0 text-xs">
                    3
                  </div>
                  <p>
                    Tap <strong>"Add"</strong> in top-right. SahakarSeva will open like a native app with zero browser bars!
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Got It, Thanks!
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Default navbar pill button
  return (
    <>
      {isInstallable ? (
        <button
          type="button"
          id="btn-install-app-nav"
          onClick={install}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer ${className}`}
          title="Install SahakarSeva as a mobile or desktop app"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Install App</span>
        </button>
      ) : isIOS ? (
        <button
          type="button"
          id="btn-install-ios-nav"
          onClick={() => setShowIOSGuide(true)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-all cursor-pointer ${className}`}
          title="Install SahakarSeva on iPhone"
        >
          <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
          <span className="hidden sm:inline">Install App</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer ${className}`}
          title="Install SahakarSeva App"
        >
          <Smartphone className="w-3.5 h-3.5 text-slate-500" />
          <span>App Info</span>
        </button>
      )}

      {/* iOS Guided Modal for Nav */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-700 p-1.5 flex items-center justify-center">
                  <img src="/icon.svg" alt="App Icon" className="w-6 h-6 object-contain" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Install SahakarSeva</h3>
                  <p className="text-[11px] text-slate-500">Fast Native Mobile Experience</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700 my-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0 text-xs">
                  1
                </div>
                <p>
                  In your mobile browser (Chrome/Safari), tap the <strong>Share</strong> or <strong>Menu (⋮)</strong> icon.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0 text-xs">
                  2
                </div>
                <p>
                  Choose <strong>"Install App"</strong> or <strong>"Add to Home Screen"</strong>.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0 text-xs">
                  3
                </div>
                <p>
                  Open from your phone home screen to enjoy <strong>fullscreen native app mode</strong> with zero URL bars and fast offline caching.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </>
  );
};
