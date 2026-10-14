export interface SimulationTelemetry {
  [key: string]: string | number;
}

export interface BaseSimulationProps {
  paused?: boolean;
  onTelemetryChange?: (telemetry: SimulationTelemetry) => void;
  width?: number;
  height?: number;
}
