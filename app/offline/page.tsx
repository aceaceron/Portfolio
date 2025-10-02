'use client';

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="max-w-md">
        <svg
          className="mx-auto h-24 w-24 text-gray-400 mb-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
          />
        </svg>
        
        <h1 className="text-3xl font-bold text-gold mb-4">
          You're Offline
        </h1>
        
        <p className="text-gray-300 mb-6">
          It looks like you've lost your internet connection. Don't worry, you can still view cached pages!
        </p>
        
        <button
          onClick={() => window.location.reload()}
          className="bg-gold text-primary px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
        >
          Try Again
        </button>
        
        <p className="text-sm text-gray-400 mt-6">
          Once you're back online, this page will automatically refresh.
        </p>
      </div>
    </div>
  );
}