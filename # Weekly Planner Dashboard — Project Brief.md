# Weekly Planner Dashboard — Project Brief

## Goal

Build a local weekly planning tool that turns a structured intake bundle into an editable, visual weekly plan.

The current product is not “brain dump in, schedule out” in one app. It is a two-stage workflow:
- Stage 1: an intake skill converts a messy weekly dump and calendar screenshot into a planner bundle JSON
- Stage 2: this local planner app lets the user review that bundle, correct structure, and schedule the week visually

The planner should feel interactive, forgiving, and human-directed:
- the system helps organize and suggest
- the user stays in control of what gets placed where
- nothing important should happen silently

---

## Current Product Shape

### Stage 1: Intake Skill

The intake skill is responsible for understanding messy input.

It should produce a combined planner bundle with:
- `projects`
- `tasks`
- `calendar_events`
- `weekly_context`

The intake skill is expected to:
- parse voice-like or messy text into actionable tasks
- infer categories / projects
- infer or confirm dependencies
- estimate durations
- parse a calendar screenshot into fixed events
- detect a current-time marker when possible
- output one planner-ready JSON bundle

This brief is mainly about Stage 2, but the app should stay aligned with that handoff format.

---

### Stage 2: Local Planner App

The local planner app begins after the bundle exists.

It should support this flow:
1. import bundle JSON by paste or file upload
2. set scheduling horizon and current-time behavior
3. review the task summary before scheduling
4. use `Current Focus` and the weekly board to place tasks
5. adjust placements manually
6. use the lower review/edit area only when deeper corrections are needed

The app is local-first and optimized for iterative personal use before any GitHub/shared release.

---

## Core UX Principles

- `Board first`
  - after a valid parse, the weekly board becomes the main surface
  - import collapses and steps back

- `Summary first`
  - the user should verify task grouping and structure before deep scheduling
  - this is an explicit Step 1 in the UI

- `No silent scheduling surprises`
  - suggestions are allowed
  - automatic placement should be minimized
  - user actions should be visible and reversible where practical

- `Chronological scheduling`
  - planning moves through open windows in time order
  - the user can also override that by dragging tasks anywhere they fit

- `Local correction beats hidden inference`
  - when structure is wrong, the app should give the user quick editing tools
  - category fixes, dependency fixes, deadline linking, optional status, and timing edits should all be possible inside the planner

---

## Inputs

### 1. Planner Bundle

Primary input is a JSON bundle from the intake skill.

Expected shape:

```json
{
  "projects": [],
  "tasks": [],
  "calendar_events": [],
  "weekly_context": {}
}
```

Important fields the planner currently relies on:

- `projects[]`
  - `id`
  - `name`

- `tasks[]`
  - `id`
  - `title`
  - `projectId`
  - `estimateMin`
  - `urgency`
  - `actionable`
  - `dependsOnIds`
  - `notes`
  - `optional`
  - `cadenceType`
  - `cadenceDays`

- `calendar_events[]`
  - `id`
  - `title`
  - `day`
  - `start`
  - `end`
  - `projectId`
  - `fixed`
  - `notes`
  - `confidence`

- `weekly_context`
  - `currentTime`
  - `timezone`
  - `deadlines`
  - `notes`

---

### 2. Local Horizon Settings

The planner can override imported timing with local settings:
- day start
- day end
- current time
- use system time toggle

If system time is used, current time should round down to the hour.

---

### 3. Optional Screenshot / Review Inputs

The app still includes a lower review/edit panel with:
- screenshot reference
- pasted extraction JSON
- fixed event editing
- task editing

But this is secondary to the main planning flow.

---

## Main Surfaces

## 1. Import Panel

Before a valid parse, import should feel like the starting step.

It should allow:
- paste JSON
- upload `.json`
- set scheduling horizon
- choose between imported current time and system time

After a successful parse:
- the import panel should lose visual priority
- it can be hidden and reopened

---

## 2. Task Summary

Task Summary is the first real working step after import.

Purpose:
- verify categories
- verify task structure
- verify dependencies / trees
- verify deadlines / anchors
- verify optional status
- verify time estimates at a glance in list view

It currently supports:
- `List` and `Tree` view
- add task
- delete task
- change optional
- edit time
- link after
- anchor to deadline
- rename category
- create category
- mark task done / undone
- drag tasks across categories
- show more / show less per category

### Task Summary Status Language

The summary should use compact status markers:
- `💭` not yet scheduled
- `📌` scheduled
- `✅` done
- `(🌿)` optional

### List View

List view is the more informational mode.

It should show:
- task rows
- status emoji
- estimate pills
- per-category workload rollup

Current per-category list rollup:
- total estimated time
- done minutes vs estimated minutes
- percent done

### Tree View

Tree view is the dependency-structure mode.

It should show:
- parent/child relationships clearly
- simple tree connectors
- less clutter than list view

The tree is used for editing order with `🔗 Link After...`

---

## 3. Current Focus

Current Focus is the guided scheduling assistant.

It should:
- identify the current open window
- suggest candidate tasks for that window
- respect dependency order in time, not just whether something is scheduled somewhere later
- allow restart from the first open window
- support repeated passes through the week

Important rule:
- if a dependency is scheduled later in the week, it should not unlock downstream tasks in an earlier window

---

## 4. Weekly Board

The Weekly Board is the main scheduling surface.

It supports:
- fixed events
- user-scheduled tasks
- open windows
- current-time marker
- warning markers

Two visual modes:
- `Calendar View`
  - shared time axis across days
  - block heights reflect duration
- `List View`
  - day-by-day stacked timeline

The board includes weekends.

Nothing before the current-time marker on the current day should be schedulable.

---

## Scheduling Model

### Fixed Events

Fixed events come from the imported calendar interpretation.

These are “higher commitment events.”

Rules:
- fixed events are locked by default
- they can be hidden with confirmation
- hidden fixed events can be restored
- restoring a fixed event takes precedence over conflicting flexible task placements

---

### Open Windows

Open windows are computed from:
- day start / end
- current time
- fixed calendar blocks
- manually scheduled tasks

The planner should move chronologically through these windows.

---

### Suggestions

Suggestions are recommendations, not commands.

They should consider:
- urgency
- duration fit
- whether task is optional
- project continuity
- dependency readiness
- unlock pressure

The planner currently includes an unlock bonus:
- tasks that unlock downstream work should score higher
- longer downstream chains should score higher
- this effect should be stronger earlier in the week

---

### Manual Placement

The user can place tasks in two main ways:
- choose from `Current Focus`
- drag from `Current Focus` onto the board

Drag/drop rules:
- drag to any valid open place on the calendar
- snap to 30-minute starts
- reject overlaps
- preserve existing placements unless there is a true conflict

Scheduled tasks can also be nudged:
- move up or down by 15 minutes
- only if space allows
- should never overwrite another scheduled item

Tasks can also be deleted from the board.

---

## Task Cadence Model

The old `repeatUntilDone` logic has been replaced by a clearer cadence model.

Each task can be:

- `once`
  - default
  - intended to be scheduled once

- `multiple`
  - can appear more than once
  - at most once per day
  - one scheduled copy is enough for “remaining task” logic
  - good example: “check whether office hours have opened”

- `routine`
  - true repeating task
  - requires a specific day interval
  - example: every 1 day, every 2 days

Rule:
- only tasks with an explicit day interval should be `routine`
- everything else that is non-one-off should usually be `multiple`

---

## Deadlines / Anchors

The planner supports deadline-like anchoring between tasks and fixed calendar events.

### Anchor Sources

Anchors should come from fixed calendar events, not from arbitrary task labels.

### Anchor Display

In the summary, anchor sections should read like:
- anchored tasks first
- then a `Must be done before ...` bubble underneath
- then later anchored sections
- then unanchored tasks

If all tasks tied to a given anchor are done:
- the anchor should switch into a celebratory completed state
- the celebration line should rotate from a curated list
- repetition should be reduced when possible

### Anchor Rules

- a category can have more than one anchor
- anchors should be ordered chronologically
- only confidently anchored tasks should appear above a given anchor
- parent tasks should be pulled into an anchor group when their descendants belong there
- unrelated tasks should stay outside that anchor group

### Manual Anchor Editing

The summary includes `⚓ Anchor to...`

It should let the user:
- click a task
- pick the fixed event it must happen before
- clear the link if needed

---

## Warnings

Warnings should be specific and calm.

Rules:
- warnings should only appear once a task is actually scheduled too late
- unscheduled tasks should not produce warning noise
- both the task and the relevant deadline/event can show warning signals
- warnings should appear both in the summary and on the board

---

## Optional Task Logic

Optional tasks are supported, but with guardrails.

Rules:
- tasks linked to deadlines cannot be optional
- optional tasks cannot be anchored to deadlines
- a required child cannot sit under an optional parent
- a task cannot become optional if it has a non-optional descendant

The summary includes `🌿 Change Optional` as a one-task-at-a-time mode.

When a change is blocked:
- the planner should explain why explicitly
- it should not fail silently

---

## Completion Logic

Marking a task done should:
- keep it visible in the summary
- cross / mark it as complete
- stop it from being suggested again
- preserve its role in summary structure

Important:
- completion should not change the anchor grouping structure
- done tasks should stay in their deadline section

---

## Current Known Intent For The Product

This app is no longer just a slot recommender.

It is now closer to:
- a bundle-driven weekly planning editor
- with summary-first structural cleanup
- guided chronological scheduling
- manual visual placement
- dependency-aware ordering
- deadline-aware warnings

The product emphasis is:
- clear structure first
- visual planning second
- low surprise throughout

---

## Near-Term Next Step

After this project brief is aligned, the next step is to revisit the intake skill so it produces bundles that fit this planner more precisely.

That likely means refining:
- cadence output
- anchor/deadline output
- category naming behavior
- optional task semantics
- fixed-event interpretation

---

## Future Extensions

These are not core current-scope requirements, but they are part of the intended direction of the product.

### 1. Calendar Integration

The ideal later version should integrate directly with Google Calendar or a similar calendar system.

That future version should be able to:
- import fixed events directly instead of relying on screenshots
- write scheduled task blocks back into the calendar
- preserve the task structure from the planner, not just export flat events

So the long-term vision is not only “read calendar constraints,” but “round-trip between planner logic and calendar reality.”

There is also a simpler near-middle path that may be preferable before full calendar API integration:
- export scheduled work as a calendar file such as `.ics`
- let the user import that file into Google Calendar manually

In that model:
- the planner remains the source of truth for dependencies, anchors, optional status, and task structure
- the calendar only receives the final scheduled blocks of time

That is acceptable because the calendar does not need to preserve planner logic; it only needs to reflect the final weekly plan.

### 2. Breaks and Focus Structure

The ideal later version should also support structured work rhythms.

Examples:
- optional breaks between work blocks
- configurable Pomodoro-style planning
- simple focus/break templates that can be layered onto scheduled work

This should remain a later extension, but it is worth documenting now because it fits naturally with the way the planner already reasons about time blocks and task duration.
