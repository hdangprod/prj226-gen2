# PRJ226 Generation 2 — Foundation Seed

## 1. Why this repository exists

PRJ226 Generation 2 is a greenfield rebuild of Liam.

Generation 1 was a useful discovery prototype, but its source code, architecture, documentation and AI-development workflow became too difficult to reason about and maintain safely.

Generation 2 must not copy Generation 1's architecture by default.

It should preserve lessons, validated product ideas and useful behavioral concepts, while redesigning the implementation from first principles.

---

# 2. Long-term product vision

Liam is intended to evolve into a Personal Life Operating System.

Its purpose is to reduce the user's mental load.

Liam should help the user:

* capture information quickly;
* organize projects and responsibilities;
* know what to do next;
* retrieve previously learned information;
* preserve context between work sessions;
* understand progress;
* identify blockers and dependencies;
* make decisions using relevant personal data and historical context;
* reduce the amount of information the user must keep in their head.

The human remains the final decision maker for important actions.

Liam should assist thinking, not replace human judgment.

---

# 3. Life domains

The long-term system may eventually support domains such as:

* Career
* Work
* Learning
* Projects
* Health
* Exercise
* Nutrition
* Finance
* Shopping
* Relationships
* Personal CRM
* Habits
* Calendar
* Goals
* Personal administration

These domains are part of the long-term vision.

Generation 2 must NOT attempt to implement all of them immediately.

---

# 4. Initial product scope

The first useful version of Generation 2 should be:

## Liam v1 — Stateful Personal Project & Knowledge Assistant

The initial system should focus on helping the user manage projects and the knowledge generated while executing those projects.

Examples of projects include:

* completing a Product Management course;
* building a portfolio project;
* completing a 12-week fitness program;
* improving IELTS;
* building PRJ226 itself.

A project is not limited to software development.

---

# 5. Core project model

The initial conceptual hierarchy is:

Area
→ Project
→ Milestone / Phase
→ Task
→ Step

This model must be validated during product design.

## Area

A long-lived responsibility without a defined completion point.

Examples:

* Career
* Learning
* Health
* Finance
* Relationships

## Project

A temporary effort with a concrete desired outcome.

Examples:

* Complete Google PM Course
* Build Backend Portfolio Project
* Complete a 12-week Lean Cut
* Build PRJ226 Generation 2

## Milestone / Phase

A meaningful stage in a Project.

## Task

A manageable unit of work with a clear result.

A Task should normally be small enough that the user can understand how to start it.

Tasks should support:

* status;
* priority;
* estimate;
* actual effort;
* dependencies;
* Definition of Done;
* related resources;
* related notes;
* completion history.

## Step

A small concrete action inside a Task.

Steps exist mainly to reduce activation energy and make starting easy.

A Step does not need to become a separately managed Task unless it needs its own dependency, deadline, ownership or tracking.

---

# 6. Core knowledge model

Project execution produces knowledge.

The initial taxonomy is:

Resource
Working Note
Finding
Decision
Reflection
Artifact

This taxonomy must also be validated during product design.

## Resource

An external source.

Examples:

* article;
* video;
* course lesson;
* book;
* paper;
* PDF;
* GitHub repository;
* website.

## Working Note

Low-friction information captured while working.

Working Notes should prioritize fast capture over perfect organization.

## Finding

Reusable knowledge extracted from experience, research or Working Notes.

## Decision

A choice made for a Project or Area.

A Decision should preserve why the choice was made and which evidence or Findings influenced it.

## Reflection

An observation about how execution went.

Examples:

* what worked;
* what failed;
* what should change;
* recurring behavioral patterns.

## Artifact

A concrete output produced by the Project.

Examples:

* report;
* design;
* source code;
* presentation;
* certificate;
* training plan.

---

# 7. Core product loop

The desired core loop is:

Define Project
→ Break into Milestones
→ Refine current Milestone into Tasks
→ Refine Task into actionable Steps
→ Execute
→ Capture Notes and Resources
→ Extract Findings / Decisions / Reflections
→ Complete Task
→ Update Project state
→ Recommend the next useful action

The system should use rolling-wave planning.

Do not fully decompose a large project into hundreds of tasks at the beginning.

Instead:

* define the major milestones;
* detail the current milestone;
* keep later milestones progressively less detailed;
* refine work as the user approaches it.

---

# 8. Important usability principle

If the user looks at a Task and still does not know how to start, the Task is not sufficiently refined.

Liam should reduce activation energy.

The system should prefer concrete next actions over abstract productivity advice.

---

# 9. Example user scenarios

Liam should eventually handle requests such as:

* “Hôm nay tôi nên tập trung vào việc gì?”
* “Tôi vừa hoàn thành task A, giờ nên làm gì tiếp?”
* “Tôi có 30 phút và năng lượng thấp. Có quick-win nào không?”
* “Tạo cho tôi một project để hoàn thành PM course này.”
* “Chia milestone hiện tại thành những task đủ nhỏ để tôi dễ bắt đầu.”
* “Note giúp tôi điều này trong task hiện tại.”
* “Tôi vừa học được điều này, lưu thành key finding.”
* “Tại sao trước đây tôi lại chọn giải pháp X?”
* “Trước đây tôi đã học gì về stakeholder management?”
* “Project này đang bị trễ, task nào đang block?”
* “Tôi phải dừng ở đây. Ghi lại tôi đang làm tới đâu và ngày mai nên bắt đầu từ việc gì.”

A larger curated Golden Dataset will be created separately.

---

# 10. Long-term decision-support vision

The eventual value of Liam is not merely storing information.

The system should eventually combine:

## Project System

What am I trying to achieve?

What should I do next?

## Knowledge System

What have I learned?

What do I know?

## Decision System

Given my history, goals, constraints and current context, what is the best next choice?

Liam sits above these systems as the conversational orchestration layer.

---

# 11. Important Generation 1 lessons

Generation 1 demonstrated several risks that Generation 2 must avoid.

Known lessons include:

* passing tests do not necessarily prove production wiring;
* mocks must not be treated as runtime integration evidence;
* documentation can become internally consistent while still being wrong;
* transport, application logic and infrastructure responsibilities must not become mixed;
* session state must have one clear authority;
* idempotency and retry behavior must be explicitly designed;
* delivery failures must not be silently treated as success;
* AI development automation must fail closed;
* development agents must not automatically merge or perform destructive Git operations;
* project documentation must have clear canonical ownership;
* development AI “skills” must not be confused with runtime product capabilities;
* an AI model should be able to reconstruct current context from the repository instead of relying on chat history.

These are lessons, not architecture decisions.

Generation 2 must re-derive architecture from product requirements.

---

# 12. AI-development principle

The repository itself must function as durable project memory.

A fresh AI model or developer should eventually be able to determine:

* what PRJ226 is;
* why it exists;
* what the current product scope is;
* what is explicitly out of scope;
* what architecture has been approved;
* why architecture decisions were made;
* what development phase is active;
* what has already been completed;
* what bugs have occurred;
* what technical debt exists;
* which task should happen next;
* what the Definition of Done is;
* which actions require human approval.

Important project context must not exist only inside AI conversations.

---

# 13. AI roles

The intended development workflow is:

## Strong reasoning model / Codex

Used primarily for:

* product modeling;
* architecture;
* difficult technical decisions;
* task planning;
* security;
* concurrency;
* review;
* complex debugging.

## Lower-cost implementation model / OpenCode

Used primarily for:

* bounded implementation tasks;
* mechanical refactoring;
* straightforward tests;
* implementation against approved contracts.

A lower-cost implementation model must not need previous Codex conversations.

It should be able to work from repository context plus an approved Task Packet.

---

# 14. Governance principle

AI may:

* analyze;
* propose;
* implement approved tasks;
* test;
* review.

AI must not independently:

* change product vision;
* approve architecture decisions;
* deploy production;
* perform destructive production migrations;
* delete production data;
* force-push protected branches;
* silently expand task scope.

Important architecture decisions require human approval.

---

# 15. Current Generation 2 status

Generation: 2

Runtime implementation: NOT STARTED

Product architecture: NOT YET APPROVED

Technical architecture: NOT YET APPROVED

Technology choices: NOT YET APPROVED

Current objective:

Define the product foundation before implementing runtime code.

Do not create runtime source code until the foundation program explicitly permits implementation.

---

# 16. Foundation questions that still need to be answered

Generation 2 still needs explicit definitions for:

* exact Liam v1 scope;
* information model;
* project lifecycle;
* task lifecycle;
* knowledge lifecycle;
* note promotion rules;
* project/knowledge relationship model;
* Golden Dataset;
* capability map;
* persistence ownership;
* architecture boundaries;
* integration strategy;
* testing strategy;
* observability;
* privacy and retention;
* project-memory architecture;
* AI governance;
* roadmap;
* Definition of Done;
* implementation task format.

These must be resolved incrementally.

Do not attempt to solve all of them in a single design session.
