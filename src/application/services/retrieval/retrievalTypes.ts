import type {
  AcceptedProgress,
  Action,
  KnowledgeItem,
  KnowledgeItemId,
  NonEmptyText,
  Project,
  ProjectId,
  ProjectState,
} from "../../../domain/model";

export type RetrievalResult<T> =
  | { readonly kind: "found"; readonly value: T }
  | {
      readonly kind: "not-found";
      readonly entityType: "project" | "knowledge-item";
      readonly id: string;
    }
  | {
      readonly kind: "retrieval-failed";
      readonly reason: string;
      readonly retryable: boolean;
    };

export interface RetrievalService {
  getProject(projectId: ProjectId): Promise<RetrievalResult<Project>>;

  listProjects(filter?: {
    readonly state?: ProjectState;
  }): Promise<RetrievalResult<readonly Project[]>>;

  getActionsForProject(
    projectId: ProjectId,
  ): Promise<RetrievalResult<readonly Action[]>>;

  getAcceptedContextFacts(
    projectId: ProjectId,
  ): Promise<RetrievalResult<readonly NonEmptyText[]>>;

  getCurrentProgress(
    projectId: ProjectId,
  ): Promise<RetrievalResult<readonly AcceptedProgress[]>>;

  getCurrentKnowledgeForProject(
    projectId: ProjectId,
  ): Promise<RetrievalResult<readonly KnowledgeItem[]>>;

  getCurrentKnowledgeAcrossProjects(options?: {
    readonly excludeOriginatingProjectId?: ProjectId;
  }): Promise<RetrievalResult<readonly KnowledgeItem[]>>;

  getKnowledgeItem(
    id: KnowledgeItemId,
  ): Promise<RetrievalResult<KnowledgeItem>>;

  getKnowledgeLineage(
    id: KnowledgeItemId,
  ): Promise<RetrievalResult<readonly KnowledgeItem[]>>;
}
