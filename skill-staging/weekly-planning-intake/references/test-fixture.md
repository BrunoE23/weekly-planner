# Weekly Planning Intake Test Fixture

Use this fixture only when the user explicitly asks for `test mode`, `fixture mode`, or similar wording.

This file is for fast local iteration. It should not affect normal skill behavior.

## Saved Transcript

```text
Okay, so here we go. I have a team demo later this week, so I need to send a reminder, confirm the room setup, and bring snacks. I also have a launch window on Friday, so I need to draft the launch page and send the email before that. For research, I need to review my notes and then update the analysis code, and I also want to keep checking whether office hours opened because signups are still closed. I have a few admin things too, like filing an expense report and submitting a benefits form. I might also book a routine checkup and maybe plan a weekend trip, but those are optional. That should be enough to start.
```

## Saved Clarifications

- the team demo is on Thursday and should be treated as the anchor for reminder, setup, and snacks
- the launch window is on Friday and should be treated as the anchor for launch prep
- drafting the launch page takes about 60 minutes
- sending the launch email takes about 30 minutes
- confirming room setup takes about 20 minutes
- bringing snacks takes about 40 minutes
- research work is 3 hours review and 3 hours implementation
- `check whether office hours opened` should be treated as a short multi-use task
- do not use an `Existing Calendar` category
- put the team reminder and setup tasks under `Team Ops`
- put workshop-style calendar events under `Research`
- use a small `Personal` category for things like workouts and weekend plans

## Saved Calendar Interpretation Snapshot

This is a saved interpretation of the screenshot, not the raw image itself.

- timezone: `America/Chicago`
- current time marker: Monday, April 6, 2026 at about `5:00 PM`
- confidence on current time: high
- fixed events observed:
  - Monday: `Workout`, 6:30-7:30 PM
  - Tuesday: `Team Sync`, 10:00-11:00 AM
  - Wednesday: `Research Workshop`, 1:00-3:00 PM
  - Thursday: `Admin Hour`, 9:00-10:00 AM
  - Thursday: `Team Demo`, 4:00-5:30 PM
  - Friday: `Launch Window`, 11:00 AM-12:30 PM
  - Saturday: `Dinner with Friends`, 7:00-9:00 PM

## How To Use This Fixture

- In test mode, start from this saved input and saved clarifications.
- Do not ask the user to repeat the rant unless they explicitly want to replace it.
- It is fine to mention that the screenshot itself is not bundled, only its saved interpretation.
- Before any final output, require a confirmation step on categories/assumptions and ask whether the user wants chat JSON or a local `.json` file.
- Normal mode should ignore this file completely.
