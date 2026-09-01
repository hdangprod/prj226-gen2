import {
  isConstructorIssuedEvent,
  type OperationalEvidenceEvent,
  type OperationalEvidenceSink,
} from "../../application/ports/observability/operationalEvidence";

export interface CloudflareStructuredLogWriter {
  log(entry: Record<string, unknown>): void;
}

export class CloudflareOperationalEvidence implements OperationalEvidenceSink {
  constructor(
    private readonly writer: CloudflareStructuredLogWriter = console,
  ) {}

  async emit(event: OperationalEvidenceEvent): Promise<void> {
    try {
      if (!isConstructorIssuedEvent(event)) {
        return;
      }

      const projected: Record<string, unknown> = {
        schemaVersion: event.schemaVersion,
        correlationId: event.correlationId,
        requestId: event.requestId,
        stage: event.stage,
        operationCategory: event.operationCategory,
        status: event.status,
        retryDisposition: event.retryDisposition,
      };

      if (event.operationId !== undefined) {
        projected.operationId = event.operationId;
      }
      if (event.failureCategory !== undefined) {
        projected.failureCategory = event.failureCategory;
      }
      if (event.entityType !== undefined) {
        projected.entityType = event.entityType;
      }
      if (event.durationMilliseconds !== undefined) {
        projected.durationMilliseconds = event.durationMilliseconds;
      }
      if (event.inputUnits !== undefined) {
        projected.inputUnits = event.inputUnits;
      }
      if (event.outputUnits !== undefined) {
        projected.outputUnits = event.outputUnits;
      }

      this.writer.log(projected);
    } catch {
      // Fail-open containment: logging errors never disrupt application flow.
    }
  }
}
