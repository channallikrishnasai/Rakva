import { EnvironmentalObservation, TemporalMode, EnvironmentalVariableId, EnvironmentalTimeSeries } from '@/core/contracts';

export interface EnvironmentalQuery {
  regionId?: string;
  geographicLevel?: string;
  variables: EnvironmentalVariableId[];
  temporalMode?: TemporalMode;
  startTime?: string;
  endTime?: string;
  sourceId?: string;
  resolution?: string;
}

export interface EnvironmentalRepository {
  /**
   * Fetch the latest observed conditions for a specific region and set of variables.
   */
  getCurrent(regionId: string, variables: EnvironmentalVariableId[]): Promise<EnvironmentalObservation[]>;

  /**
   * Fetch historical observations over a specific time window.
   */
  getHistorical(query: EnvironmentalQuery): Promise<EnvironmentalObservation[]>;

  /**
   * Fetch forecast observations over a specific time window.
   */
  getForecast(query: EnvironmentalQuery): Promise<EnvironmentalObservation[]>;

  /**
   * Get an entire time series (hourly/daily) for a specific variable.
   */
  getTimeSeries(regionId: string, variable: EnvironmentalVariableId, mode: TemporalMode): Promise<EnvironmentalTimeSeries>;
}
