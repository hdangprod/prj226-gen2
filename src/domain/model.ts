export type Brand<Value, Name extends string> = Value & {
  readonly __brand: Name;
};

export type ProjectId = Brand<string, "ProjectId">;
export type ActionId = Brand<string, "ActionId">;
export type ProgressId = Brand<string, "ProgressId">;
export type KnowledgeItemId = Brand<string, "KnowledgeItemId">;
export type NonEmptyText = Brand<string, "NonEmptyText">;

export type ProjectState = "Active" | "Completed";
export type ActionState = "Open" | "Completed";
export type ProgressStanding = "current" | "superseded";
export type KnowledgeStanding = "current" | "superseded";

export interface Project {
  readonly id: ProjectId;
  readonly intendedOutcome: NonEmptyText;
  readonly state: ProjectState;
}

export interface Action {
  readonly id: ActionId;
  readonly projectId: ProjectId;
  readonly description: NonEmptyText;
  readonly state: ActionState;
}

export interface AcceptedProgress {
  readonly id: ProgressId;
  readonly projectId: ProjectId;
  readonly statement: NonEmptyText;
  readonly actionId?: ActionId;
  readonly standing: ProgressStanding;
  readonly supersedesId?: ProgressId;
}

export interface AcceptedProjectContext {
  readonly projectId: ProjectId;
  readonly facts: readonly NonEmptyText[];
  readonly progress: readonly AcceptedProgress[];
}

export type CurrentContext =
  | {
      readonly basis: "explicit-user-selection";
      readonly projectId: ProjectId;
      readonly actionId?: ActionId;
    }
  | {
      readonly basis: "qualified-inference";
      readonly projectId: ProjectId;
      readonly actionId?: ActionId;
      readonly qualification: NonEmptyText;
    }
  | {
      readonly basis: "ambiguous";
      readonly candidateProjectIds: readonly ProjectId[];
    };

export interface KnowledgeItem {
  readonly id: KnowledgeItemId;
  readonly originatingProjectId: ProjectId;
  readonly content: NonEmptyText;
  readonly standing: KnowledgeStanding;
  readonly supersedesId?: KnowledgeItemId;
  readonly supersessionChain: readonly KnowledgeItemId[];
}

export interface KnowledgeReference {
  readonly knowledgeItemId: KnowledgeItemId;
  readonly originatingProjectId: ProjectId;
  readonly assistingProjectId: ProjectId;
  readonly standing: KnowledgeStanding;
  readonly qualification?: NonEmptyText;
}

export function nonEmptyText(value: string): NonEmptyText | undefined {
  const normalized = value.trim();
  return normalized.length > 0 ? (normalized as NonEmptyText) : undefined;
}

export function projectId(value: string): ProjectId {
  return value as ProjectId;
}

export function actionId(value: string): ActionId {
  return value as ActionId;
}

export function progressId(value: string): ProgressId {
  return value as ProgressId;
}

export function knowledgeItemId(value: string): KnowledgeItemId {
  return value as KnowledgeItemId;
}
