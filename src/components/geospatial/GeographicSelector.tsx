"use client";

import { useState, useEffect } from 'react';
import { useGeographic } from '@/hooks/GeographicContext';

const STATE_OPTIONS = [
  { id: 'IN-KA', name: 'Karnataka' },
  { id: 'IN-MH', name: 'Maharashtra' },
  { id: 'IN-TN', name: 'Tamil Nadu' },
  { id: 'IN-KL', name: 'Kerala' },
  { id: 'IN-MP', name: 'Madhya Pradesh' },
  { id: 'IN-GJ', name: 'Gujarat' },
];

const DISTRICT_OPTIONS: Record<string, Array<{ id: string; name: string }>> = {
  'IN-KA': [
    { id: 'IN-KA-BLR', name: 'Bangalore Urban' },
    { id: 'IN-KA-BLG', name: 'Belagavi' },
    { id: 'IN-KA-MYS', name: 'Mysuru' },
  ],
  'IN-MH': [
    { id: 'IN-MH-MUM', name: 'Mumbai' },
    { id: 'IN-MH-PUN', name: 'Pune' },
    { id: 'IN-MH-NAG', name: 'Nagpur' },
  ],
  'IN-MP': [
    { id: 'IN-MP-BHP', name: 'Bhopal' },
    { id: 'IN-MP-IND', name: 'Indore' },
  ],
  'IN-TN': [
    { id: 'IN-TN-CHN', name: 'Chennai' },
    { id: 'IN-TN-CBE', name: 'Coimbatore' },
  ],
  'IN-KL': [
    { id: 'IN-KL-TVM', name: 'Thiruvananthapuram' },
    { id: 'IN-KL-ERK', name: 'Ernakulam' },
  ],
  'IN-GJ': [
    { id: 'IN-GJ-AHD', name: 'Ahmedabad' },
    { id: 'IN-GJ-SRT', name: 'Surat' },
  ],
};

export function GeographicSelector() {
  const { context, navigateToRegion } = useGeographic();
  const [selectedState, setSelectedState] = useState(context.stateId || '');
  const [selectedDistrict, setSelectedDistrict] = useState(context.districtId || '');

  useEffect(() => {
    setSelectedState(context.stateId || '');
    setSelectedDistrict(context.districtId || '');
  }, [context.stateId, context.districtId]);

  const handleStateChange = async (stateId: string) => {
    setSelectedState(stateId);
    setSelectedDistrict('');
    if (stateId) {
      await navigateToRegion(stateId);
    }
  };

  const handleDistrictChange = async (districtId: string) => {
    setSelectedDistrict(districtId);
    if (districtId) {
      await navigateToRegion(districtId);
    }
  };

  const districts = selectedState ? (DISTRICT_OPTIONS[selectedState] || []) : [];

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2">
        <label htmlFor="country" className="text-[10px] text-slate-500 font-mono">
          Country:
        </label>
        <select
          id="country"
          value="IN"
          disabled
          className="rounded border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-400 disabled:opacity-50"
        >
          <option value="IN">India</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="state" className="text-[10px] text-slate-500 font-mono">
          State:
        </label>
        <select
          id="state"
          value={selectedState}
          onChange={(e) => handleStateChange(e.target.value)}
          className="rounded border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-300 hover:border-cyan-500/50 focus:border-cyan-500 focus:outline-none"
        >
          <option value="">Select State</option>
          {STATE_OPTIONS.map((state) => (
            <option key={state.id} value={state.id}>
              {state.name}
            </option>
          ))}
        </select>
      </div>

      {selectedState && (
        <div className="flex items-center gap-2">
          <label htmlFor="district" className="text-[10px] text-slate-500 font-mono">
            District:
          </label>
          <select
            id="district"
            value={selectedDistrict}
            onChange={(e) => handleDistrictChange(e.target.value)}
            className="rounded border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-300 hover:border-cyan-500/50 focus:border-cyan-500 focus:outline-none"
          >
            <option value="">Select District</option>
            {districts.map((district) => (
              <option key={district.id} value={district.id}>
                {district.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
