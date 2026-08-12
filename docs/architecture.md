# RAKVA Architecture Guide

## Overview
RAKVA follows a domain-driven architectural pattern separating data acquisition, intelligence processing, and user presentation.

```text
Data (Repositories, Registries)
→ Intelligence (Adapters, Hazards)
→ Decision (Risk/Priority)
→ UI (Components, Presentation)
```

## Adding a New Hazard
1. Implement the `HazardDefinition` contract (`src/core/contracts/index.ts`).
2. Register the instance in `src/core/registries/index.ts` using `hazardRegistry.register()`.
3. The UI will dynamically fetch from the registry; no UI code changes are required.

## Adding a New Map Layer
1. Implement the `MapLayerDefinition` contract.
2. Ensure layer-specific thresholds and color legends are defined in `src/config/thresholds.ts`.
3. Register via `mapLayerRegistry.register()`.

## Adding a New Data Source
1. Implement the `DataSource` contract.
2. Register via `dataSourceRegistry.register()`.

## Adding a New AI Model Adapter
1. Implement `AIModelAdapter<Input, Output>` (`src/core/adapters/ai-model.ts`).
2. Wire the adapter in the respective Intelligence service (to be built in Phase 2).
3. Do not directly call the adapter from UI components.
