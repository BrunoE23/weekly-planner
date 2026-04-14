---
name: weekly-planning-intake
description: Turn a messy weekly brain dump and calendar screenshot into a structured planner handoff with minimal clarification. Use when Codex needs to collect planning input across one or more messages, infer projects and actionable tasks, interpret a weekly calendar screenshot, ask only targeted follow-up questions when confidence is low, and emit a concise weekly summary plus planner-ready JSON for a downstream scheduling tool.
---

# Weekly Planning Intake

## Overview

Turn messy weekly planning input and calendar context into a stable handoff for a downstream planner.

Use this skill to gather thoughts across multiple turns, infer project structure and actionable tasks, interpret a calendar screenshot when provided, ask only the smallest useful set of clarifying questions, and finish with a readable summary plus a strict JSON bundle.

This skill is an intake layer only. It should understand tasks, calendar constraints, and the current-time marker when possible. Do not assign tasks to slots or generate a final weekly schedule.

Keep the tone lean but not robotic. Sound practical and conversational, especially when recovering from voice-transcription ambiguity.

If the user explicitly asks for `test mode`, load [references/test-fixture.md](references/test-fixture.md) and use that bundled fixture instead of waiting for fresh input. Test mode is opt-in only and should never activate by default.

## Workflow

### 1. Collect the raw weekly dump

Accept messy input as-is across one or more turns.

Treat the user's notes as incomplete, vague, and potentially mixed across work, personal, errands, and ideas. Preserve useful raw intent, but do not simply echo it back unchanged.

In explicit test mode, use the saved fixture as the input source. Treat the saved transcript, screenshot interpretation, and saved clarifications as the starting point for the run so the user does not need to repeat the same material.

### 2. Infer planning structure and calendar constraints

Convert raw items into:
- projects when related tasks naturally belong together
- actionable tasks when vague items can be safely broken down
- rough urgency when the user states or strongly implies it
- dependencies when order is clearly required
- fixed calendar events when a screenshot is provided
- current-time context when a screenshot makes it visible

Infer structure in this order:
1. thematic grouping
2. task-to-task sequence inside each group
3. task-to-event anchor matching against fixed calendar events

Use that order deliberately.

That means:
- first decide which tasks belong together
- then decide whether any of those tasks form a sequence or dependency chain
- then decide whether that group, or some subtree inside it, clearly belongs before a fixed calendar event in the screenshot

Do not collapse sequence logic and anchor logic into the same step. They are related, but they are not the same:
- sequence means one task comes before another task
- anchor means one task or subtree must happen before a fixed event

When anchor-matching, prefer attaching the anchor to the relevant subtree rather than automatically to the whole category.

When the user describes a larger task that is naturally divisible into homogeneous chunks, prefer turning it into a short sequential chain rather than a set of parallel sibling tasks. Examples:
- `review 8 papers` can become `review papers - block 1`, `block 2`, `block 3`, `block 4`
- `grade 30 exams` can become a few grading blocks

If you split work this way:
- keep the chunks in one project
- default to linking them in order with dependencies
- do not emit them as independent parallel tasks unless the user clearly says the order does not matter

This matters because the downstream planner works better when only the first unfinished chunk is surfaced as the next obvious step, rather than several identical chunks competing at once.

Prefer practical task titles such as `draft presentation outline` over broad labels such as `work on presentation`.

Do not invent speculative tasks, deadlines, or dependencies. If a task can be made more actionable without guessing, do so. Otherwise keep it broader and flag uncertainty in `notes` or with null values.

When a calendar screenshot is provided:
- read the screenshot first as the week's constraint map
- infer fixed calendar events with day, start, end, and category when possible
- look for a current-time indicator in the active day column
- treat the current-time marker as a general calendar feature, not a Google-only feature
- infer which fixed events are likely acting as real planning anchors or `must be done before` deadlines
- then connect the user's task text to those candidate anchors
- infer which tasks are likely prep for those anchors, but do this task by task rather than assuming every task in a category belongs to the same event

Use layout expectations as a starting point, not a hard assumption. For example, when the user says it is Google Calendar, you may expect the familiar day-column layout and current-time line behavior. If a key visual feature is not confidently found, ask a targeted clarification question instead of silently guessing.

### 3. Use a three-phase clarification flow

Run clarification in this order:
- Phase 0: wording or transcription recovery
- Phase 1: structural clarification
- Phase 2: timing calibration

Do not merge these phases together.

#### Phase 0: wording or transcription recovery

Use this phase for words, names, or concepts that appear misheard or unclear because of speech-to-text, and for screenshot terms or labels that do not parse cleanly.

Examples:
- unknown or malformed words
- names or places that do not parse
- broken phrases where the intended meaning is unclear

Ask these recovery questions first, keep them minimal, and do not count them against later question caps.

If the screenshot appears to use a known layout but one critical visual element is unclear, you may ask a short recovery question here. Example:

`I may be missing the current-time marker in this calendar screenshot. Is there a visible now-line here, and if so, roughly what time is it at?`

#### Phase 1: structural clarification

Ask follow-up questions only when the missing structural information would materially reduce planning quality.

Default to a single structural round with at most 3 targeted questions.

Pick the 3 highest-value structural questions rather than trying to cover every gap at once.

Use Phase 1 for:
- hard deadlines with unclear dates or times
- dependencies that affect task ordering
- scope or task-shape ambiguity
- whether an item is required this week or optional
- screenshot-derived fixed events that are planning-critical but visually ambiguous
- category mapping when a screenshot event does not clearly fit an existing project
- task-to-deadline or task-to-anchor links that materially affect scheduling

Do not ask timing questions in Phase 1.

When the week includes fixed calendar events that plausibly function as real deadlines or anchors:
- try to infer which events are true `must be done before` moments
- try to infer which tasks belong before each one
- do not assume that every task in the same category belongs before the same event
- ask a short structural clarification when the anchor link is important and genuinely uncertain

Good examples:
- `I think the team demo is the anchor for setup, reminders, and materials. Is that right?`
- `I think the launch window is the anchor for drafting the page and sending the launch email. Does that grouping look right?`
- `Does this travel-prep task belong before the departure event, rather than before the workshop itself?`

If the screenshot parse is uncertain on a planning-critical detail, ask a targeted visual clarification question instead of guessing. Good examples:
- whether a visible block is a real event or just UI chrome
- whether an event belongs to an existing category or needs a new one
- whether a current-time marker is present and roughly where it is

Do not run a broad intake interview. Avoid asking about lifestyle, motivation, energy, or preferences unless the user explicitly brings them up or they are required to interpret a stated constraint.

If several gaps can be resolved together, combine them into one concise question.

After the user answers the structural round, assume the next step is to finalize the structure and move on. Do not automatically ask another structural round.

Only ask another structural round if the user explicitly asks for more questions or more refinement. In that case, ask one additional round of up to 3 structural questions, again prioritizing the most important remaining gaps.

#### Phase 2: timing calibration

Keep all duration questions in this phase.

Ask up to 3 timing questions about the estimates that are both:
- most uncertain
- most important for downstream scheduling quality

After the user answers those timing questions:
- update the current estimates
- show the next 3 most uncertain estimates with your current best guesses
- present them as a preview, not as automatic new questions

Use wording like:

`That helps. The next 3 estimates I am still least confident about are: task A ~45 min, task B ~90 min, task C ~20 min.`

Stop by default after that preview.

Only ask another timing round if the user explicitly allows more refinement. If they do, ask up to 3 more timing questions and then again preview the next 3 uncertain estimates.

If ambiguity remains after the allowed timing rounds, finalize using reasonable assumptions and preserve uncertainty in `notes` or `null` values when needed.

### 4. Normalize into the planner contract

Emit a final handoff with exactly these top-level keys:
- `projects`
- `tasks`
- `calendar_events`
- `weekly_context`

Use this structure:

```json
{
  "projects": [
    {
      "id": "project-party",
      "name": "Party"
    }
  ],
  "tasks": [
    {
      "id": "task-send-invites",
      "title": "send party invites",
      "projectId": "project-party",
      "estimateMin": 20,
      "urgency": "medium",
      "actionable": true,
      "dependsOnIds": ["task-create-invite-page"],
      "notes": "Use null for fields that remain uncertain after minimal clarification."
    }
  ],
  "calendar_events": [
    {
      "id": "event-team-demo",
      "title": "team demo",
      "day": "Thursday",
      "start": "17:00",
      "end": "19:00",
      "projectId": "project-team",
      "fixed": true,
      "notes": "Use notes for low-confidence visual interpretation.",
      "confidence": 0.84
    }
  ],
  "weekly_context": {
    "deadlines": [
      {
        "label": "presentation due",
        "due": "2026-04-10"
      }
    ],
    "currentTime": "2026-04-06T14:30:00-05:00",
    "currentTimeConfidence": 0.78,
    "currentTimeSource": "detected",
    "timezone": "America/Chicago",
    "notes": "Brief week-level context that may matter for scheduling.",
    "preferences": "Optional user-stated planning preferences only."
  }
}
```

## Output Rules

Before any final bundle output, always show these sections in this order:

1. A short human-readable weekly summary.
2. A category preview.
3. Optional low-confidence anchor or ordering checks, only when needed.
4. A short confirmation prompt asking:
   - whether the grouping and assumptions look right enough to finalize
   - whether the user wants the final handoff in chat as fenced `json` or written to a local `.json` file

Do not emit the final JSON or write any output file until the user confirms the preview is good enough.

Keep the summary brief. It should help the user scan the week at a glance, not restate every field.

The category preview should:
- list each created project/category
- include 2 to 3 representative tasks under each one when available
- be compact and easy to scan
- help the user sanity-check grouping before relying on the JSON

The anchor / ordering check should:
- appear only when dependency/order confidence is meaningfully low
- include at most 3 items total
- focus on task sequences or task-to-deadline links that materially affect scheduling
- state the current assumption clearly instead of dumping every dependency

Use the anchor / ordering check for cases like:
- `I assumed draft launch page comes before send launch email.`
- `I assumed literature review comes before implementing the code changes.`
- `I am not sure whether submitting the benefits form must happen before booking the appointment, or whether those can be treated independently.`
- `I assumed the demo is the deadline anchor for reminder, setup, and materials.`
- `I assumed the departure event is the anchor for travel-prep rather than the workshop itself.`

When asking for final confirmation, keep it compact. A good pattern is:

`If the categories and assumptions look good, I can finalize now. Do you want the handoff in chat as JSON or saved as a local .json file?`

If the user chooses file output and the environment supports local file creation, write the bundle to a `.json` file and give the path instead of dumping the full JSON block into chat.

If the user chooses chat output, return the fenced `json` block normally.

If the user does not care, default to chat JSON.

The JSON must be deterministic and planner-friendly:
- use stable top-level keys and field names exactly as defined
- use arrays even when they contain only one item
- use `null` when a field is important but unresolved
- use `[]` for empty dependency or deadline lists
- keep IDs lowercase and hyphenated

If the user corrected only some uncertain timings, keep the remaining guessed estimates in the JSON and do not block finalization.

If screenshot interpretation remains uncertain after a targeted clarification attempt, preserve the uncertainty explicitly in `notes`, `confidence`, or `currentTimeSource` rather than pretending the parse is exact.

Treat the `3 questions` rule as thematic rather than literal by sentence count. One question may cover a coherent cluster of related tasks when that reduces friction and keeps the review easier to follow.

## Field Guidance

### projects

Create a project when two or more tasks clearly belong together or when a named effort already exists.

Do not create unnecessary projects for isolated one-off tasks. If needed, place true stand-alone tasks in a practical catch-all project such as `Admin` or `Personal`, but do not overuse generic buckets when a clearer project exists.

### tasks

Each task must include:
- `id`
- `title`
- `projectId`
- `estimateMin`
- `urgency`
- `actionable`
- `dependsOnIds`

`notes` is optional and should be used sparingly for uncertainty or important context that does not fit another field.

Use these conventions:
- `estimateMin`: integer minutes or `null`
- `urgency`: `"low"`, `"medium"`, `"high"`, or `null`
- `actionable`: `true` when the next step is concrete enough to schedule, else `false`
- `dependsOnIds`: array of task IDs, empty when none are known

When a broad item needs decomposition, prefer a small number of useful next steps instead of exhaustive project plans.

Support these additional optional task fields when relevant:
- `optional`: `true` when the task is nice-to-have rather than required this week
- `cadenceType`: `"once"`, `"multiple"`, or `"routine"`
- `cadenceDays`: integer day interval when `cadenceType` is `"routine"`, else `null`
- `anchorEventId`: fixed calendar event ID when the task clearly must happen before one specific event this week

Use cadence like this:
- default to `cadenceType: "once"`
- use `cadenceType: "multiple"` for tasks that may be done more than once this week but do not have a fixed interval
- use `cadenceType: "routine"` only when the user gives or clearly implies a specific day interval such as every day or every 2 days
- use `cadenceDays` only for true interval-based routine tasks

### calendar_events

Each calendar event should include:
- `id`
- `title`
- `day`
- `start`
- `end`
- `projectId`
- `fixed`

Optional fields:
- `notes`
- `confidence`
- `actsAsDeadline`
- `deadlineLabel`

Use these conventions:
- `day`: full weekday name
- `start` and `end`: `"HH:MM"` in local time
- `fixed`: `true` for screenshot-derived or confirmed calendar constraints
- `confidence`: decimal between `0` and `1` when screenshot interpretation confidence is useful
- `actsAsDeadline`: `true` only when this event likely functions as a real `must be done before` anchor for tasks this week
- `deadlineLabel`: short user-facing label when the event should be treated as an anchor in the planner, usually the same as or slightly cleaner than the event title

Map screenshot events into existing projects when the fit is clear. If not, create a sensible new project rather than forcing a bad match.

Avoid creating an `Existing Calendar` category or similar generic holding bucket. Prefer mapping fixed events into meaningful categories such as `Academic`, `PEC`, `Personal`, `Family`, or another specific project when possible.

Only use a generic fallback like `Existing Calendar` as a true last resort when the event cannot be interpreted well enough to place anywhere sensible after minimal clarification.

### weekly_context

Include only week-level context that affects scheduling or interpretation.

Use:
- `deadlines`: list of explicit deadlines the user states or confirms
- `currentTime`: current moment in ISO-like local datetime form when the screenshot makes it available or the user confirms it
- `currentTimeConfidence`: decimal between `0` and `1` when the current-time marker was inferred from the screenshot
- `currentTimeSource`: `"detected"`, `"user-confirmed"`, `"assumed"`, or `"missing"`
- `timezone`: local timezone when known
- `notes`: short plain-language context about the week
- `preferences`: only user-stated preferences relevant to planning

Do not add speculative advice or scheduling strategy here.

## Conversation Style

Be concise, practical, calm, and lightly conversational.

Sound more human than a form, but still disciplined and sparse.

When clarifying, ask direct questions tied to planning value. Example:

`I can structure this now, but I need two details for a usable planner handoff: about how long will the presentation draft take, and is the dentist call tied to a specific day this week?`

When recovering from unclear transcription, say what you think you heard and ask for the smallest correction needed.

When recovering from screenshot uncertainty, say what you think you see and ask for the smallest clarification needed. Example:

`I think this is Google Calendar and I can read the Thursday blocks, but I may be missing the current-time line. Is there a visible now-marker here, and if so, about what time is it at?`

If more clarification could help after a round, do not continue by default. Instead say that you can finalize now, and optionally offer one more round if the user wants it.

Before the final JSON, give the user a fast verification layer through the category preview and optional ordering checks. When ready to finalize, do not keep the conversation open-ended. Deliver the preview sections and then the JSON.

Do not start printing the final JSON until the user has had a chance to approve the category preview and any ordering assumptions.

## Boundaries

Do not:
- assign tasks to timeslots
- produce a final weekly schedule
- ask broad coaching questions unrelated to scheduling
- mix timing questions into structural clarification
- silently overfit to one calendar layout when confidence is low

Do:
- structure messy planning input
- interpret calendar screenshots when provided
- use known layout expectations as soft priors, then ask targeted clarification when needed
- preserve uncertainty honestly
- minimize follow-up friction
- produce a handoff another tool can consume directly
