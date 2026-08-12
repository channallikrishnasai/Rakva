"use client";

import { useState, useEffect } from 'react';
import { useGeographic } from '@/hooks/GeographicContext';

export function GeographicSearch() {
  const { searchRegions, navigateToRegion } = useGeographic();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Array<{ region: any; path: any[] }>>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timeout = setTimeout(async () => {
      const searchResults = await searchRegions(query);
      setResults(searchResults);
      setIsOpen(searchResults.length > 0);
    }, 300);

    return () => clearTimeout(timeout);
  }, [query, searchRegions]);

  const handleSelect = async (regionId: string) => {
    await navigateToRegion(regionId);
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search states, districts..."
        className="w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-300 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
        aria-label="Geographic search"
      />

      {isOpen && results.length > 0 && (
        <div className="absolute z-20 mt-1 w-full rounded border border-slate-700 bg-slate-800 shadow-lg">
          {results.slice(0, 8).map((result) => (
            <button
              key={result.region.id}
              onClick={() => handleSelect(result.region.id)}
              className="w-full px-3 py-2 text-left hover:bg-slate-700/50 border-b border-slate-700/30 last:border-0"
            >
              <div className="text-sm text-slate-300">{result.region.name}</div>
              <div className="text-[10px] text-slate-500 font-mono">
                {result.path.map(p => p.name).join(' → ')}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
