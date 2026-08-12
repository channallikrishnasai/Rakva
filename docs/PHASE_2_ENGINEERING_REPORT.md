# RAKVA Phase 2 Engineering Report
## Transforming the Command Center into a Fully Data-Driven Interface

### 1. Executive Summary
In Phase 2, the primary objective was to refactor the Command Center to be completely data-driven. The prior implementation used hardcoded constants for positions, dependencies, priorities, and labels within the UI components. This phase successfully migrated these components to consume strongly-typed domain contracts (`Asset`) provided via a repository layer. A centralized context-based state management solution was implemented to handle global selections and derived data (filters, rankings), ensuring a highly decoupled and extensible architecture.

### 2. Architectural Changes
*   **Domain Expansion (`src/core/contracts/index.ts`)**: The `Asset` domain model was enriched with presentation and decision-engine specific properties, such as `visualization` (2D/3D map positions, rotation, scale), `dependencies`, `evidence`, and `priorityMetrics`.
*   **Repository Layer Update (`src/data/mock/repositories.ts`)**: `MockAssetRepository` was updated to accurately map underlying mock data (`commandCenterData`) to the expanded `Asset` domain model.
*   **Centralized State Hook (`src/hooks/useCommandCenterState.ts`)**: Implemented a React hook to handle data fetching from the repository, track user selections, calculate derived state (`filteredAssets`, `priorityRankings`), and handle visual toggles (3D/2D).
*   **Context API (`src/hooks/CommandCenterContext.tsx`)**: The state hook was wrapped in a React Context to be easily consumable by any panel or component within the Command Center without prop-drilling, meeting the requirement of using a narrowly scoped Context and avoiding external state libraries like Zustand or Redux.

### 3. Component Migration
All Command Center visual components were successfully refactored:
*   **3D Scene (`DisasterScene3D.tsx`)**: Removed hardcoded marker arrays and dependency definitions. Replaced them with map functions iterating over the injected domain `Asset[]`. Scene positions are now determined by `asset.visualization.scenePosition`. 
*   **2D Map (`DisasterMap.tsx`)**: Refactored to utilize `asset.visualization.mapPosition` and standard domain types.
*   **Intelligence Panels (`AssetIntelligencePanel`, `EvidenceFusionPanel`, `DynamicReassessment`, `WhatIfPanel`, `EvidenceTimeline`)**: Adapted entirely to accept the new `Asset` contract. Panel logic now resolves values like `priorityMetrics`, `evidenceSources`, and confidence metrics from standard data shapes rather than UI-bound variables.

### 4. Verification and Safety
*   **Type Safety**: All UI layers adhere to strictly-defined interfaces.
*   **Performance**: High-frequency 3D render loop operations (via `useFrame` in Three.js) were intentionally kept outside the React Context to avoid re-render storms, in alignment with performance requirements.
*   **Build Integrity**: The repository passes `tsc --noEmit` and successfully builds the production Next.js bundle without compilation errors.

### 5. Next Steps (Phase 3 Preparation)
The Command Center is now structurally prepared to accept dynamic data inputs. When transitioning to Phase 3, the `MockAssetRepository` can be seamlessly swapped with real API-driven repositories (e.g., GraphQL or REST bindings) without modifying the UI layer.
