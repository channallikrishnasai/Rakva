import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EvidenceTimeline } from '../EvidenceTimeline';
import { EvidenceFusionPanel } from '../EvidenceFusionPanel';
import { EvidenceDetailsDrawer } from '../EvidenceDetailsDrawer';
import { EvidenceFiltersComponent } from '../EvidenceFilters';
import type { EvidenceIntelligence, EvidenceFusionResult, EvidenceFilter } from '@/core/contracts';

const mockEvidence: EvidenceIntelligence[] = [
  {
    id: 'EV-001',
    sourceId: 'satellite-1',
    type: 'satellite_image',
    status: 'verified',
    description: 'Satellite imagery shows flooding in eastern district',
    location: [23.81, 90.41],
    regionId: 'eastern-district',
    assetId: 'BRIDGE-024',
    timestamp: new Date().toISOString(),
    confidence: 'high',
    confidenceScore: 85,
    quality: 'verified',
    provenance: {
      source: 'Sentinel-2',
      sourceType: 'satellite',
      timestamp: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      confidence: 85,
      quality: 'verified',
    },
    tags: ['flooding', 'infrastructure'],
  },
  {
    id: 'EV-002',
    sourceId: 'drone-1',
    type: 'drone_footage',
    status: 'verifying',
    description: 'Drone footage shows structural damage to bridge',
    location: [23.81, 90.41],
    regionId: 'eastern-district',
    assetId: 'BRIDGE-024',
    timestamp: new Date().toISOString(),
    confidence: 'very-high',
    confidenceScore: 92,
    quality: 'verified',
    provenance: {
      source: 'DJI Matrice',
      sourceType: 'sensor',
      timestamp: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      confidence: 92,
      quality: 'verified',
    },
    tags: ['structural-damage', 'bridge'],
  },
];

const mockFusionResult: EvidenceFusionResult = {
  id: 'fusion-001',
  targetId: 'BRIDGE-024',
  targetType: 'asset',
  fusedConfidence: 'high',
  fusedConfidenceScore: 88,
  evidenceCount: 2,
  verifiedCount: 1,
  conflictCount: 0,
  sources: ['satellite-1', 'drone-1'],
  summary: '2 evidence items from 2 sources. 1 verified, 0 flagged for conflict.',
  breakdown: [
    {
      sourceId: 'satellite-1',
      sourceName: 'Sentinel-2 Satellite',
      evidenceType: 'satellite_image',
      weight: 0.9,
      contribution: 76.5,
      confidence: 85,
      status: 'verified',
    },
    {
      sourceId: 'drone-1',
      sourceName: 'DJI Matrice Drone',
      evidenceType: 'drone_footage',
      weight: 0.85,
      contribution: 78.2,
      confidence: 92,
      status: 'verifying',
    },
  ],
  conflictFlags: [],
  fusedAt: new Date().toISOString(),
  modelVersion: '1.0.0',
};

describe('Evidence Components Integration', () => {
  describe('EvidenceTimeline', () => {
    it('should render evidence items', () => {
      render(<EvidenceTimeline items={mockEvidence} />);
      
      expect(screen.getByText(/satellite imagery/i)).toBeInTheDocument();
      expect(screen.getByText(/drone footage/i)).toBeInTheDocument();
    });

    it('should display status badges', () => {
      render(<EvidenceTimeline items={mockEvidence} />);
      
      expect(screen.getByText('VERIFIED')).toBeInTheDocument();
      expect(screen.getByText('VERIFYING')).toBeInTheDocument();
    });

    it('should display confidence scores', () => {
      render(<EvidenceTimeline items={mockEvidence} />);
      
      expect(screen.getByText('85%')).toBeInTheDocument();
      expect(screen.getByText('92%')).toBeInTheDocument();
    });

    it('should handle item selection', () => {
      const onSelect = vi.fn();
      render(<EvidenceTimeline items={mockEvidence} onSelect={onSelect} />);
      
      const firstItem = screen.getByText(/satellite imagery/i).closest('button');
      fireEvent.click(firstItem!);
      
      expect(onSelect).toHaveBeenCalledWith(mockEvidence[0]);
    });

    it('should highlight selected item', () => {
      render(<EvidenceTimeline items={mockEvidence} selectedId="EV-001" />);
      
      const firstItem = screen.getByText(/satellite imagery/i).closest('button');
      expect(firstItem).toHaveClass('border-cyan-500/50');
    });

    it('should display tags', () => {
      render(<EvidenceTimeline items={mockEvidence} />);
      
      expect(screen.getByText('flooding')).toBeInTheDocument();
      expect(screen.getByText('infrastructure')).toBeInTheDocument();
    });

    it('should handle empty items', () => {
      render(<EvidenceTimeline items={[]} />);
      
      expect(screen.getByText(/no evidence items found/i)).toBeInTheDocument();
    });
  });

  describe('EvidenceFusionPanel', () => {
    it('should render fusion results', () => {
      render(<EvidenceFusionPanel result={mockFusionResult} />);
      
      expect(screen.getByText(/evidence fusion/i)).toBeInTheDocument();
      expect(screen.getByText(/88/)).toBeInTheDocument();
    });

    it('should display stats', () => {
      render(<EvidenceFusionPanel result={mockFusionResult} />);
      
      expect(screen.getByText('TOTAL')).toBeInTheDocument();
      expect(screen.getByText('VERIFIED')).toBeInTheDocument();
      expect(screen.getByText('SOURCES')).toBeInTheDocument();
    });

    it('should display source breakdown', () => {
      render(<EvidenceFusionPanel result={mockFusionResult} />);
      
      expect(screen.getByText('Sentinel-2 Satellite')).toBeInTheDocument();
      expect(screen.getByText('DJI Matrice Drone')).toBeInTheDocument();
    });

    it('should display summary', () => {
      render(<EvidenceFusionPanel result={mockFusionResult} />);
      
      expect(screen.getByText(/2 evidence items from 2 sources/i)).toBeInTheDocument();
    });

    it('should handle conflicts', () => {
      const resultWithConflicts = {
        ...mockFusionResult,
        conflictCount: 1,
        conflictFlags: [
          {
            sourceA: 'satellite-1',
            sourceB: 'drone-1',
            description: 'Conflicting reports about flooding',
            severity: 'high' as const,
          },
        ],
      };

      render(<EvidenceFusionPanel result={resultWithConflicts} />);
      
      expect(screen.getByText(/conflicts detected/i)).toBeInTheDocument();
      expect(screen.getByText(/conflicting reports about flooding/i)).toBeInTheDocument();
    });
  });

  describe('EvidenceDetailsDrawer', () => {
    it('should render evidence details when open', () => {
      render(<EvidenceDetailsDrawer evidence={mockEvidence[0]} onClose={() => {}} />);
      
      expect(screen.getByText(/evidence details/i)).toBeInTheDocument();
      expect(screen.getByText(/satellite imagery/i)).toBeInTheDocument();
    });

    it('should display metadata', () => {
      render(<EvidenceDetailsDrawer evidence={mockEvidence[0]} onClose={() => {}} />);
      
      expect(screen.getByText('Sentinel-2')).toBeInTheDocument();
      expect(screen.getByText('verified')).toBeInTheDocument();
    });

    it('should handle close button', () => {
      const onClose = vi.fn();
      render(<EvidenceDetailsDrawer evidence={mockEvidence[0]} onClose={onClose} />);
      
      const closeButton = screen.getByText('×');
      fireEvent.click(closeButton);
      
      expect(onClose).toHaveBeenCalled();
    });

    it('should handle backdrop click', () => {
      const onClose = vi.fn();
      render(<EvidenceDetailsDrawer evidence={mockEvidence[0]} onClose={onClose} />);
      
      // The backdrop is the element with absolute positioning that covers the entire screen
      const backdrop = document.querySelector('.absolute.inset-0');
      fireEvent.click(backdrop!);
      
      expect(onClose).toHaveBeenCalled();
    });

    it('should not render when evidence is null', () => {
      const { container } = render(<EvidenceDetailsDrawer evidence={null} onClose={() => {}} />);
      
      expect(container.firstChild).toBeNull();
    });

    it('should display tags', () => {
      render(<EvidenceDetailsDrawer evidence={mockEvidence[0]} onClose={() => {}} />);
      
      expect(screen.getByText('flooding')).toBeInTheDocument();
      expect(screen.getByText('infrastructure')).toBeInTheDocument();
    });
  });

  describe('EvidenceFiltersComponent', () => {
    it('should render filter options', () => {
      const filter: EvidenceFilter = {};
      const onChange = vi.fn();
      render(<EvidenceFiltersComponent filter={filter} onChange={onChange} />);
      
      expect(screen.getByPlaceholderText(/search evidence/i)).toBeInTheDocument();
      expect(screen.getByText('Satellite')).toBeInTheDocument();
      expect(screen.getByText('Drone')).toBeInTheDocument();
      expect(screen.getByText('Verified')).toBeInTheDocument();
    });

    it('should handle search input', () => {
      const filter: EvidenceFilter = {};
      const onChange = vi.fn();
      render(<EvidenceFiltersComponent filter={filter} onChange={onChange} />);
      
      const searchInput = screen.getByPlaceholderText(/search evidence/i);
      fireEvent.change(searchInput, { target: { value: 'bridge' } });
      
      expect(onChange).toHaveBeenCalledWith({ searchQuery: 'bridge' });
    });

    it('should toggle type filter', () => {
      const filter: EvidenceFilter = {};
      const onChange = vi.fn();
      render(<EvidenceFiltersComponent filter={filter} onChange={onChange} />);
      
      const satelliteButton = screen.getByText('Satellite');
      fireEvent.click(satelliteButton);
      
      expect(onChange).toHaveBeenCalledWith({ types: ['satellite_image'] });
    });

    it('should toggle status filter', () => {
      const filter: EvidenceFilter = {};
      const onChange = vi.fn();
      render(<EvidenceFiltersComponent filter={filter} onChange={onChange} />);
      
      const verifiedButton = screen.getByText('Verified');
      fireEvent.click(verifiedButton);
      
      expect(onChange).toHaveBeenCalledWith({ statuses: ['verified'] });
    });

    it('should clear all filters', () => {
      const filter: EvidenceFilter = {
        types: ['satellite_image'],
        statuses: ['verified'],
        searchQuery: 'test',
      };
      const onChange = vi.fn();
      render(<EvidenceFiltersComponent filter={filter} onChange={onChange} />);
      
      const clearButton = screen.getByText(/clear all filters/i);
      fireEvent.click(clearButton);
      
      expect(onChange).toHaveBeenCalledWith({});
    });

    it('should show clear button only when filters are active', () => {
      const filter: EvidenceFilter = {};
      const onChange = vi.fn();
      render(<EvidenceFiltersComponent filter={filter} onChange={onChange} />);
      
      expect(screen.queryByText(/clear all filters/i)).not.toBeInTheDocument();
    });
  });

  describe('Component Integration Workflow', () => {
    it('should render timeline and handle selection to show details', () => {
      const onSelect = vi.fn();
      render(<EvidenceTimeline items={mockEvidence} onSelect={onSelect} />);
      
      // Click on first evidence item
      const firstItem = screen.getByText(/satellite imagery/i).closest('button');
      fireEvent.click(firstItem!);
      
      expect(onSelect).toHaveBeenCalledWith(mockEvidence[0]);
    });

    it('should render fusion panel with breakdown', () => {
      render(<EvidenceFusionPanel result={mockFusionResult} />);
      
      // Verify all sections are rendered
      expect(screen.getByText(/evidence fusion/i)).toBeInTheDocument();
      expect(screen.getByText(/source breakdown/i)).toBeInTheDocument();
      expect(screen.getByText('Sentinel-2 Satellite')).toBeInTheDocument();
    });

    it('should render filters and apply changes', () => {
      const filter: EvidenceFilter = {};
      const onChange = vi.fn();
      render(<EvidenceFiltersComponent filter={filter} onChange={onChange} />);
      
      // Apply type filter
      fireEvent.click(screen.getByText('Satellite'));
      expect(onChange).toHaveBeenCalledWith({ types: ['satellite_image'] });
      
      // Apply status filter
      fireEvent.click(screen.getByText('Verified'));
      expect(onChange).toHaveBeenCalledWith({ statuses: ['verified'] });
    });
  });
});
