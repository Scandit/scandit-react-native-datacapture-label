import {TurboModule, TurboModuleRegistry} from 'react-native';
import type {EventEmitter} from 'react-native/Libraries/Types/CodegenTypes';
/**
 * Unified event payload for all Scandit events.
 * Events are filtered by name on the JS side.
 */
export type ScanditEventPayload = {
  name: string;
  data: string;
  viewId?: number;
  modeId?: number;
};

export interface Spec extends TurboModule {
  // Events - unified event emitter for all Label events
  readonly onScanditEvent: EventEmitter<ScanditEventPayload>;

  readonly getConstants: () => {
    // eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
    Defaults: Object;
  };

  // Single entry point for all Label operations - use Object so codegen produces NSDictionary on iOS
  // eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
  executeLabel(data: Object): Promise<void>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('ScanditDataCaptureLabel');
