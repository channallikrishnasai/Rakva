"use client";

import { useGeographic } from '@/hooks/GeographicContext';

export function Breadcrumbs() {
  const { context, selectedRegion, goBack } = useGeographic();

  const buildPath = (): Array<{ id: string; name: string; level: string }> => {
    const path: Array<{ id: string; name: string; level: string }> = [
      { id: 'IN', name: 'India', level: 'country' }
    ];

    if (context.stateId) {
      const stateNames: Record<string, string> = {
        'IN-KA': 'Karnataka',
        'IN-MH': 'Maharashtra',
        'IN-TN': 'Tamil Nadu',
        'IN-KL': 'Kerala',
        'IN-MP': 'Madhya Pradesh',
        'IN-GJ': 'Gujarat',
      };
      path.push({
        id: context.stateId,
        name: stateNames[context.stateId] || context.stateId,
        level: 'state'
      });
    }

    if (context.districtId) {
      const districtNames: Record<string, string> = {
        'IN-KA-BLR': 'Bangalore Urban',
        'IN-KA-BLG': 'Belagavi',
        'IN-MH-MUM': 'Mumbai',
        'IN-MP-BHP': 'Bhopal',
        'IN-TN-CHN': 'Chennai',
        'IN-GJ-AHD': 'Ahmedabad',
      };
      path.push({
        id: context.districtId,
        name: districtNames[context.districtId] || context.districtId,
        level: 'district'
      });
    }

    if (selectedRegion && !path.some(p => p.id === selectedRegion.id)) {
      path.push({
        id: selectedRegion.id,
        name: selectedRegion.name,
        level: selectedRegion.level
      });
    }

    return path;
  };

  const path = buildPath();

  return (
    <nav className="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
      {path.map((item, index) => (
        <div key={item.id} className="flex items-center gap-2">
          {index > 0 && (
            <svg className="h-4 w-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
          <button
            onClick={() => {
              if (index === 0) {
                goBack();
              }
            }}
            className={`font-mono ${
              index === path.length - 1
                ? 'text-cyan-400'
                : 'text-slate-400 hover:text-white'
            } transition-colors`}
          >
            {item.name}
          </button>
        </div>
      ))}
    </nav>
  );
}
