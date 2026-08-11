PRAGMA foreign_keys = ON;

CREATE TABLE persistence_operations (
  operation_id TEXT PRIMARY KEY NOT NULL,
  fingerprint TEXT NOT NULL
) STRICT;

CREATE TABLE projects (
  id TEXT PRIMARY KEY NOT NULL,
  intended_outcome TEXT NOT NULL CHECK (length(trim(intended_outcome)) > 0),
  state TEXT NOT NULL CHECK (state IN ('Active', 'Completed'))
) STRICT;

CREATE TABLE actions (
  id TEXT PRIMARY KEY NOT NULL,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE RESTRICT,
  description TEXT NOT NULL CHECK (length(trim(description)) > 0),
  state TEXT NOT NULL CHECK (state IN ('Open', 'Completed'))
) STRICT;

CREATE TRIGGER preserve_project_identity
BEFORE UPDATE ON projects
WHEN NEW.intended_outcome <> OLD.intended_outcome
BEGIN
  SELECT RAISE(ABORT, 'project identity collision');
END;

CREATE TRIGGER preserve_action_identity
BEFORE UPDATE ON actions
WHEN NEW.project_id <> OLD.project_id OR NEW.description <> OLD.description
BEGIN
  SELECT RAISE(ABORT, 'action identity collision');
END;

CREATE TABLE accepted_context_facts (
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE RESTRICT,
  ordinal INTEGER NOT NULL CHECK (ordinal >= 0),
  fact TEXT NOT NULL CHECK (length(trim(fact)) > 0),
  PRIMARY KEY (project_id, ordinal)
) STRICT;

CREATE TABLE accepted_progress (
  id TEXT PRIMARY KEY NOT NULL,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE RESTRICT,
  action_id TEXT REFERENCES actions(id) ON DELETE RESTRICT,
  statement TEXT NOT NULL CHECK (length(trim(statement)) > 0),
  standing TEXT NOT NULL CHECK (standing IN ('current', 'superseded')),
  supersedes_id TEXT UNIQUE REFERENCES accepted_progress(id) ON DELETE RESTRICT,
  CHECK (id IS NOT supersedes_id)
) STRICT;

CREATE TRIGGER validate_progress_action_ownership
BEFORE INSERT ON accepted_progress
WHEN NEW.action_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM actions
    WHERE id = NEW.action_id AND project_id = NEW.project_id
  )
BEGIN
  SELECT RAISE(ABORT, 'progress action ownership constraint');
END;

CREATE TRIGGER validate_progress_correction
BEFORE INSERT ON accepted_progress
WHEN NEW.supersedes_id IS NOT NULL
  AND (NEW.standing <> 'current' OR NOT EXISTS (
    SELECT 1 FROM accepted_progress
    WHERE id = NEW.supersedes_id
      AND standing = 'current'
      AND project_id = NEW.project_id
      AND action_id IS NEW.action_id
  ))
BEGIN
  SELECT RAISE(ABORT, 'progress correction constraint');
END;

CREATE TRIGGER supersede_corrected_progress
AFTER INSERT ON accepted_progress
WHEN NEW.supersedes_id IS NOT NULL
BEGIN
  UPDATE accepted_progress SET standing = 'superseded' WHERE id = NEW.supersedes_id;
END;

CREATE TABLE knowledge_items (
  id TEXT PRIMARY KEY NOT NULL,
  originating_project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE RESTRICT,
  content TEXT NOT NULL CHECK (length(trim(content)) > 0),
  standing TEXT NOT NULL CHECK (standing IN ('current', 'superseded')),
  supersedes_id TEXT UNIQUE REFERENCES knowledge_items(id) ON DELETE RESTRICT,
  supersession_chain TEXT NOT NULL CHECK (json_valid(supersession_chain)),
  CHECK (id IS NOT supersedes_id)
) STRICT;

CREATE TRIGGER validate_knowledge_correction
BEFORE INSERT ON knowledge_items
WHEN NEW.supersedes_id IS NOT NULL
  AND (NEW.standing <> 'current' OR NOT EXISTS (
    SELECT 1 FROM knowledge_items
    WHERE id = NEW.supersedes_id
      AND standing = 'current'
      AND originating_project_id = NEW.originating_project_id
      AND json(NEW.supersession_chain) = json_insert(supersession_chain, '$[#]', id)
  ))
BEGIN
  SELECT RAISE(ABORT, 'knowledge correction constraint');
END;

CREATE TRIGGER supersede_corrected_knowledge
AFTER INSERT ON knowledge_items
WHEN NEW.supersedes_id IS NOT NULL
BEGIN
  UPDATE knowledge_items SET standing = 'superseded' WHERE id = NEW.supersedes_id;
END;
