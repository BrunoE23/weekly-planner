# Weekly Planner Dashboard

A local-first weekly planning app that turns a structured intake bundle into a visual weekly plan.

Live app:
- [https://brunoe23.github.io/weekly-planner/](https://brunoe23.github.io/weekly-planner/)

This project currently has two parts:
- a planner app for reviewing tasks, fixed events, deadlines, and weekly scheduling
- an intake workflow that turns messy text plus a calendar screenshot into a planner-ready JSON bundle

## Privacy / Data Handling

- This planner runs entirely in your browser as a static site.
- It does not send your planner bundle, calendar screenshot, or task data to a backend server.
- Imported files are read locally in the browser.
- Session state is stored only in your browser session unless you export it yourself.
- If you use ChatGPT or Claude for intake, that part is handled by those services, not by this planner app.

## What It Does

The planner app lets you:
- import a planner bundle as pasted JSON or a `.json` file
- review tasks by category before scheduling
- switch between `Tree` and `List` task-summary views
- edit task structure, dependencies, deadlines, optional status, and cadence
- see fixed calendar events and open windows across the week
- schedule tasks visually with suggestions, drag-and-drop, and nudging
- get warnings when a scheduled task is placed after a relevant deadline or anchor event

The intake side currently exists as:
- a Codex skill
- a ChatGPT prompt version
- a Claude prompt version

## Current Workflow

1. Use the intake flow to convert a messy weekly dump into a planner bundle.
2. Open the hosted planner app.
3. Import the bundle.
4. Review categories and task structure in `Task Summary`.
5. Schedule the week in `Current Focus` and the weekly board.

## Local Run

This version is a static local app.

To run it:
1. Open `index.html` in a browser.
2. Paste a planner bundle or upload a `.json` file.

Main files:
- [`index.html`](./index.html)
- [`planner-app.js`](./planner-app.js)
- [`styles.css`](./styles.css)

## Key Concepts

The planner currently uses these ideas:
- `Task Summary` as a first-pass structural review step
- `Current Focus` as the guided chronological scheduling assistant
- `Anchors` / `Must be done before` events derived from fixed calendar blocks
- `Cadence` for tasks that are `once`, `multiple`, or `routine`

The app is intentionally local-first and low-integration right now. The main goal is to make the workflow work well before adding heavier infrastructure.

## Included Docs

- [`# Weekly Planner Dashboard — Project Brief.md`](./%23%20Weekly%20Planner%20Dashboard%20%E2%80%94%20Project%20Brief.md)
- [`Conversational App Design Methodology.md`](./Conversational%20App%20Design%20Methodology.md)
- [`Weekly Planning Intake Prompt - ChatGPT.md`](./Weekly%20Planning%20Intake%20Prompt%20-%20ChatGPT.md)
- [`Weekly Planning Intake Prompt - Claude.md`](./Weekly%20Planning%20Intake%20Prompt%20-%20Claude.md)

## Current Status

This is still a prototype, but it is already usable locally.

What is relatively solid:
- importing planner bundles
- task-summary editing
- weekly board interactions
- anchor/deadline warnings
- cadence support

What is still evolving:
- intake heuristics
- eventual calendar export or integration
- public packaging polish

## Planned Next Steps

- refine the intake prompts / skill so they map tasks to anchors better
- make the project easier to share publicly
- possibly export final scheduled blocks as `.ics`
- later consider direct calendar integration if it is worth the extra complexity
