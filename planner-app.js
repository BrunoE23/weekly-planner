const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const PROJECT_COLORS = ["#d97a66", "#6f9db8", "#88a97d", "#d2a05b", "#9b8bc3", "#6fa89c", "#c98a9a", "#b58b6a"];
const URGENCY_LABELS = ["", "high", "medium", "low"];
const URGENCY_ORDER = { high: 42, medium: 26, low: 12, "": 18 };
const SESSION_KEY = "weekly-planner-v2";
const SKIP_VALUE = "__skip__";
const CELEBRATION_MESSAGES = [
  "Gears all turning! ⚙️",
  "Everything wrapped up! 📦",
  "Right on target! 🎯",
  "Work fully finished! 🏁",
  "To the moon! 🚀",
  "Brain did thing! 🧠",
  "Fast and clean! ⚡",
  "Gains secured! 💪",
  "All pieces aligned! 🧩",
  "Numbers went up! 📈"
];

const SAMPLE_BUNDLE = {
  projects: [
    { id: "project-launch", name: "Launch Prep" },
    { id: "project-team", name: "Team Ops" },
    { id: "project-research", name: "Research" },
    { id: "project-admin", name: "Admin" },
    { id: "project-health", name: "Personal" }
  ],
  tasks: [
    { id: "task-draft-launch-page", title: "draft launch page copy", projectId: "project-launch", estimateMin: 60, urgency: "high", actionable: true, dependsOnIds: [], notes: "", optional: false },
    { id: "task-send-launch-email", title: "send launch email", projectId: "project-launch", estimateMin: 30, urgency: "high", actionable: true, dependsOnIds: ["task-draft-launch-page"], notes: "", optional: false },
    { id: "task-review-demo-script", title: "review demo script", projectId: "project-launch", estimateMin: 45, urgency: "medium", actionable: true, dependsOnIds: [], notes: "", optional: false },
    { id: "task-confirm-room-setup", title: "confirm room setup", projectId: "project-team", estimateMin: 20, urgency: "high", actionable: true, dependsOnIds: [], notes: "Needs to happen before the team demo.", optional: false },
    { id: "task-send-team-reminder", title: "send team reminder", projectId: "project-team", estimateMin: 15, urgency: "high", actionable: true, dependsOnIds: [], notes: "Send before the workshop day.", optional: false },
    { id: "task-bring-snacks", title: "bring snacks for workshop", projectId: "project-team", estimateMin: 40, urgency: "medium", actionable: true, dependsOnIds: [], notes: "", optional: false },
    { id: "task-review-paper-notes", title: "review paper notes", projectId: "project-research", estimateMin: 180, urgency: "medium", actionable: true, dependsOnIds: [], notes: "", optional: false },
    { id: "task-update-analysis", title: "update analysis code", projectId: "project-research", estimateMin: 180, urgency: "medium", actionable: true, dependsOnIds: ["task-review-paper-notes"], notes: "", optional: false },
    { id: "task-check-office-hours", title: "check whether office hours opened", projectId: "project-research", estimateMin: 15, urgency: "medium", actionable: true, dependsOnIds: [], notes: "Can be checked on multiple days while signup is still closed.", optional: false, cadenceType: "multiple", cadenceDays: null },
    { id: "task-file-expense-report", title: "file expense report", projectId: "project-admin", estimateMin: 45, urgency: "medium", actionable: true, dependsOnIds: [], notes: "", optional: false },
    { id: "task-submit-benefits-form", title: "submit benefits form", projectId: "project-admin", estimateMin: 30, urgency: "high", actionable: true, dependsOnIds: [], notes: "", optional: false },
    { id: "task-book-checkup", title: "book routine checkup", projectId: "project-health", estimateMin: 20, urgency: "low", actionable: true, dependsOnIds: [], notes: "Optional this week.", optional: true },
    { id: "task-plan-weekend-trip", title: "plan weekend trip", projectId: "project-health", estimateMin: 45, urgency: "low", actionable: true, dependsOnIds: [], notes: "Optional and flexible.", optional: true }
  ],
  calendar_events: [
    { id: "event-workout", title: "Workout", day: "Monday", start: "18:30", end: "19:30", projectId: "project-health", fixed: true, notes: "", confidence: 0.98 },
    { id: "event-team-sync", title: "Team Sync", day: "Tuesday", start: "10:00", end: "11:00", projectId: "project-team", fixed: true, notes: "", confidence: 0.97 },
    { id: "event-research-workshop", title: "Research Workshop", day: "Wednesday", start: "13:00", end: "15:00", projectId: "project-research", fixed: true, notes: "", confidence: 0.96 },
    { id: "event-admin-hour", title: "Admin Hour", day: "Thursday", start: "09:00", end: "10:00", projectId: "project-admin", fixed: true, notes: "", confidence: 0.92 },
    { id: "event-team-demo", title: "Team Demo", day: "Thursday", start: "16:00", end: "17:30", projectId: "project-team", fixed: true, notes: "", confidence: 0.98 },
    { id: "event-launch", title: "Launch Window", day: "Friday", start: "11:00", end: "12:30", projectId: "project-launch", fixed: true, notes: "", confidence: 0.99 },
    { id: "event-friend-dinner", title: "Dinner with Friends", day: "Saturday", start: "19:00", end: "21:00", projectId: "project-health", fixed: true, notes: "", confidence: 0.95 }
  ],
  weekly_context: {
    deadlines: [
      { label: "Send team reminder", due: "2026-04-08" },
      { label: "Team demo starts", due: "2026-04-09T16:00:00-05:00" },
      { label: "Launch window opens", due: "2026-04-10T11:00:00-05:00" }
    ],
    currentTime: "2026-04-06T17:00",
    currentTimeConfidence: 0.93,
    currentTimeSource: "detected",
    timezone: "America/Chicago",
    notes: "Sample week for testing the planner workflow.",
    preferences: null
  }
};

  const state = {
    bundleInput: "",
    extractionInput: "",
    projects: [],
    tasks: [],
    calendarEvents: [],
    weeklyContext: { deadlines: [], notes: "", preferences: null, currentTime: "", currentTimeConfidence: null, currentTimeSource: "", timezone: "" },
    screenshotDataUrl: "",
    settings: { dayStart: 8, dayEnd: 22, useSystemTime: true },
  choices: {},
  manualPlacements: [],
  completedTaskIds: [],
  hiddenFixedEventIds: [],
  plan: null,
  importStatus: "",
  importStatusTone: "",
  showDetails: false,
  boardView: "calendar",
  importCollapsed: false,
  dragTaskId: "",
  dragSource: "",
  expandedProjectIds: [],
  userCreatedProjectIds: [],
  taskSummaryAtEnd: false,
  summaryView: "tree",
  addTaskMode: false,
  renameCategoryMode: false,
  deleteTaskMode: false,
  treeEditMode: false,
  treeParentTaskId: "",
  timeEditMode: false,
  deadlineEditMode: false,
  optionalEditMode: false,
  taskAnchorOverrides: {},
  anchorCelebrationById: {},
  recentCelebrations: []
    };

const els = {};

document.addEventListener("DOMContentLoaded", () => {
    cacheElements();
    hydrateDayOptions();
    bindEvents();
    restoreSession();
    applyCurrentTimeMode();
    renderAll();
  });

  function cacheElements() {
    [
      "bundle-input", "import-status", "day-start", "day-end", "current-time", "use-system-time",
      "task-summary", "focus-window", "planner-board", "carryover-summary",
      "carryover-output", "stats-strip", "warnings", "details-panel",
      "events-editor", "tasks-editor", "event-day", "event-project",
      "screenshot-preview", "vision-prompt", "extraction-input"
    ].forEach((id) => { els[toCamel(id)] = document.getElementById(id); });
}

function bindEvents() {
  document.getElementById("load-sample").addEventListener("click", loadSample);
  document.getElementById("clear-session").addEventListener("click", clearSession);
  document.getElementById("toggle-details").addEventListener("click", () => toggleDetails());
  document.getElementById("close-details").addEventListener("click", () => toggleDetails(false));
    document.getElementById("toggle-import-panel-top").addEventListener("click", toggleImportPanel);
    document.getElementById("confirm-task-summary").addEventListener("click", confirmTaskSummary);
    document.getElementById("new-summary-category").addEventListener("click", createSummaryCategory);
    document.getElementById("add-summary-task-global").addEventListener("click", toggleAddTaskMode);
    document.getElementById("rename-summary-category-global").addEventListener("click", toggleRenameCategoryMode);
    document.getElementById("delete-summary-task-global").addEventListener("click", toggleDeleteTaskMode);
    document.getElementById("toggle-optional-edit").addEventListener("click", toggleOptionalEditMode);
  document.getElementById("summary-view-list").addEventListener("click", () => setSummaryView("list"));
    document.getElementById("summary-view-tree").addEventListener("click", () => setSummaryView("tree"));
    document.getElementById("toggle-time-edit").addEventListener("click", toggleTimeEditMode);
    document.getElementById("toggle-tree-edit").addEventListener("click", toggleTreeEditMode);
    document.getElementById("toggle-deadline-edit").addEventListener("click", toggleDeadlineEditMode);
    document.getElementById("view-calendar").addEventListener("click", () => setBoardView("calendar"));
    document.getElementById("view-list").addEventListener("click", () => setBoardView("list"));
    document.getElementById("import-bundle").addEventListener("click", importBundle);
    document.getElementById("restart-focus").addEventListener("click", restartSchedulingPass);
    document.getElementById("bundle-file-input").addEventListener("change", onBundleFileUpload);
    document.getElementById("restore-fixed-events").addEventListener("click", restoreHiddenFixedEvents);
  document.getElementById("clear-choices").addEventListener("click", clearSchedulingDecisions);
  if (document.getElementById("copy-carryover")) document.getElementById("copy-carryover").addEventListener("click", () => copyText(els.carryoverOutput.value));
  document.getElementById("copy-vision-prompt").addEventListener("click", () => copyText(els.visionPrompt.value));
  document.getElementById("import-extraction").addEventListener("click", importExtractionEvents);
  document.getElementById("event-form").addEventListener("submit", addManualEvent);
  document.getElementById("new-category").addEventListener("click", createProjectViaPrompt);
  document.getElementById("new-task-category").addEventListener("click", createProjectViaPrompt);
  document.getElementById("screenshot-input").addEventListener("change", onScreenshotUpload);
  els.taskSummary.addEventListener("click", onTaskSummaryClick);
  els.taskSummary.addEventListener("dragstart", onTaskDragStart);
  els.taskSummary.addEventListener("dragend", onTaskDragEnd);
  els.taskSummary.addEventListener("dragover", onTaskSummaryDragOver);
  els.taskSummary.addEventListener("drop", onTaskSummaryDrop);
  els.bundleInput.addEventListener("input", (e) => { state.bundleInput = e.target.value; saveSession(); });
  els.extractionInput.addEventListener("input", (e) => { state.extractionInput = e.target.value; saveSession(); });
    ["day-start", "day-end", "current-time", "use-system-time"].forEach((id) => document.getElementById(id).addEventListener("change", onSettingsChange));
  els.focusWindow.addEventListener("click", onFocusClick);
  els.focusWindow.addEventListener("dragstart", onTaskDragStart);
  els.focusWindow.addEventListener("dragend", onTaskDragEnd);
  els.plannerBoard.addEventListener("dragover", onBoardDragOver);
  els.plannerBoard.addEventListener("drop", onBoardDrop);
  els.plannerBoard.addEventListener("click", onBoardClick);
  els.eventsEditor.addEventListener("input", onEventEditorInput);
  els.eventsEditor.addEventListener("change", onEventEditorInput);
  els.eventsEditor.addEventListener("click", onEventEditorClick);
  els.tasksEditor.addEventListener("input", onTaskEditorInput);
  els.tasksEditor.addEventListener("change", onTaskEditorInput);
  els.tasksEditor.addEventListener("click", onTaskEditorClick);
}

  function loadSample() {
    state.bundleInput = JSON.stringify(SAMPLE_BUNDLE, null, 2);
    els.bundleInput.value = state.bundleInput;
    importBundle();
    state.settings.useSystemTime = true;
    buildAndRenderPlan();
  }

  function clearSession() {
    if (!window.confirm("Clear the current planner session?")) return;
    Object.assign(state, {
      bundleInput: "", extractionInput: "", projects: [], tasks: [], calendarEvents: [],
      weeklyContext: { deadlines: [], notes: "", preferences: null, currentTime: "", currentTimeConfidence: null, currentTimeSource: "", timezone: "" },
      screenshotDataUrl: "", settings: { dayStart: 8, dayEnd: 22, useSystemTime: true }, choices: {}, manualPlacements: [], completedTaskIds: [], hiddenFixedEventIds: [], plan: null,
      importStatus: "", importStatusTone: "", showDetails: false, boardView: "calendar", importCollapsed: false, dragTaskId: "", dragSource: "", expandedProjectIds: [], userCreatedProjectIds: [], taskSummaryAtEnd: false, summaryView: "tree", addTaskMode: false, renameCategoryMode: false, deleteTaskMode: false, treeEditMode: false, treeParentTaskId: "", timeEditMode: false, deadlineEditMode: false, optionalEditMode: false, taskAnchorOverrides: {}
      , anchorCelebrationById: {}, recentCelebrations: []
    });
    sessionStorage.removeItem("weekly-planner-v2");
    document.getElementById("screenshot-input").value = "";
    applyCurrentTimeMode();
    renderAll();
  }

function toggleDetails(force) {
  state.showDetails = typeof force === "boolean" ? force : !state.showDetails;
  renderDetailsVisibility();
  saveSession();
}

function toggleImportPanel() {
  state.importCollapsed = !state.importCollapsed;
  renderImportPanelState();
  saveSession();
}

function confirmTaskSummary() {
  state.taskSummaryAtEnd = true;
  renderTaskSummaryPlacement();
  saveSession();
}

function createSummaryCategory() {
  const placeholder = nextNewCategoryName();
  const projectId = ensureProject(placeholder);
  state.userCreatedProjectIds = [...new Set([...state.userCreatedProjectIds, projectId])];
  state.expandedProjectIds = [...new Set([...state.expandedProjectIds, projectId])];
  renderAll();
  saveSession();
}

function clearSchedulingDecisions() {
  state.choices = {};
  state.manualPlacements = [];
  setStatus("Cleared manual placements and suggestion choices.", "ok");
  buildAndRenderPlan();
}

function restartSchedulingPass() {
  state.choices = {};
  setStatus("Restarted the week from the first open window while keeping your placed tasks.", "ok");
  buildAndRenderPlan();
}

function restoreHiddenFixedEvents() {
  if (!state.hiddenFixedEventIds.length) return;
  persistExplicitAssignments();
  const hiddenIds = new Set(state.hiddenFixedEventIds);
  const restoredEvents = state.calendarEvents.filter((event) => hiddenIds.has(event.id));
  const removedSegments = evictScheduledConflicts(restoredEvents);
  const count = restoredEvents.length;
  state.hiddenFixedEventIds = [];
  setStatus(`Restored ${count} hidden calendar item${count === 1 ? "" : "s"}${removedSegments ? ` and removed ${removedSegments} conflicting scheduled task${removedSegments === 1 ? "" : "s"}` : ""}.`, "ok");
  buildAndRenderPlan();
}

function evictScheduledConflicts(restoredEvents) {
  if (!restoredEvents.length || !state.plan?.assignedSegments?.length) return 0;
  const overlappingSegments = state.plan.assignedSegments.filter((segment) =>
    restoredEvents.some((event) => segmentsOverlap(event.day, event.start, event.end, segment.day, segment.start, segment.end))
  );

  if (!overlappingSegments.length) return 0;

  const removalKeys = new Set(overlappingSegments.map((segment) => scheduledKey(segment.task.id, segment.day, segment.start)));
  state.manualPlacements = state.manualPlacements.filter((placement) => !removalKeys.has(scheduledKey(placement.taskId, placement.day, placement.start)));
  overlappingSegments.forEach((segment) => {
    if (segment.promptId) delete state.choices[segment.promptId];
  });
  return overlappingSegments.length;
}

function segmentsOverlap(dayA, startA, endA, dayB, startB, endB) {
  if (dayA !== dayB) return false;
  return toMinutes(startA) < toMinutes(endB) && toMinutes(endA) > toMinutes(startB);
}

function setBoardView(view) {
  state.boardView = view;
  renderBoardControls();
  renderPlannerBoard();
  saveSession();
}

  function importBundle() {
    const raw = els.bundleInput.value.trim();
    if (!raw) return setStatus("Paste a planner bundle first.", "error");
    try {
      const parsed = JSON.parse(raw);
      const normalized = normalizeBundle(parsed);
      state.projects = normalized.projects;
      state.tasks = normalized.tasks;
      state.calendarEvents = normalized.calendarEvents;
      state.weeklyContext = normalized.weeklyContext;
      state.settings.useSystemTime = !Boolean(normalized.weeklyContext.currentTime);
      state.bundleInput = JSON.stringify(parsed, null, 2);
      state.choices = {};
      state.manualPlacements = [];
      state.completedTaskIds = [];
      state.hiddenFixedEventIds = [];
      state.expandedProjectIds = [];
      state.userCreatedProjectIds = [];
      state.taskSummaryAtEnd = false;
        state.summaryView = "tree";
        state.treeEditMode = false;
        state.treeParentTaskId = "";
        state.timeEditMode = false;
        state.deadlineEditMode = false;
          state.optionalEditMode = false;
          state.addTaskMode = false;
          state.renameCategoryMode = false;
          state.deleteTaskMode = false;
          state.taskAnchorOverrides = {};
          state.importCollapsed = true;
    setStatus(`Imported ${state.tasks.length} tasks and ${state.calendarEvents.length} fixed events.`, "ok");
    buildAndRenderPlan();
  } catch (error) {
    setStatus(error.message || "Could not parse the bundle.", "error");
  }
}

function onBundleFileUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const contents = String(reader.result || "");
    state.bundleInput = contents;
    els.bundleInput.value = contents;
    setStatus(`Loaded "${file.name}" into the bundle box.`, "ok");
    saveSession();
  };
  reader.onerror = () => {
    setStatus(`Could not read "${file.name}".`, "error");
  };
  reader.readAsText(file);
}

function normalizeBundle(parsed) {
  if (!parsed || !Array.isArray(parsed.projects) || !Array.isArray(parsed.tasks)) throw new Error('Bundle needs "projects[]" and "tasks[]".');
  const projects = parsed.projects.map((project, index) => ({ id: slugify(project.id || project.name || `project-${index + 1}`), name: String(project.name || project.id || `Project ${index + 1}`).trim() }));
  const projectIds = new Set(projects.map((project) => project.id));
  const tasks = parsed.tasks.map((task, index) => ({
    id: slugify(task.id || `task-${index + 1}`),
    title: String(task.title || `Task ${index + 1}`).trim(),
    projectId: projectIds.has(task.projectId) ? task.projectId : (projects[0]?.id || ""),
    estimateMin: normalizeEstimate(task.estimateMin),
    urgency: normalizeUrgency(task.urgency),
    actionable: task.actionable !== false,
    dependsOnIds: Array.isArray(task.dependsOnIds) ? task.dependsOnIds.map((id) => slugify(id)) : [],
    notes: String(task.notes || "").trim(),
    optional: task.optional === true || /optional/i.test(String(task.notes || "")),
    ...deriveCadence(task)
  }));
  const calendarEvents = Array.isArray(parsed.calendar_events) ? parsed.calendar_events.map((event, index) => normalizeCalendarEvent(event, index, projects)).filter(Boolean) : [];
  const weeklyContext = {
    deadlines: Array.isArray(parsed.weekly_context?.deadlines) ? parsed.weekly_context.deadlines.map((deadline) => ({ label: String(deadline.label || "Deadline").trim(), due: String(deadline.due || "").trim() })) : [],
    notes: String(parsed.weekly_context?.notes || "").trim(),
    preferences: parsed.weekly_context?.preferences ?? null,
    currentTime: normalizeDateTimeLocal(parsed.weekly_context?.currentTime),
    currentTimeConfidence: parsed.weekly_context?.currentTimeConfidence ?? null,
    currentTimeSource: String(parsed.weekly_context?.currentTimeSource || "").trim(),
    timezone: String(parsed.weekly_context?.timezone || "").trim()
  };
  return { projects, tasks, calendarEvents, weeklyContext };
}

function normalizeCalendarEvent(event, index, projectCollection = state.projects) {
  const title = String(event.title || `Event ${index + 1}`).trim();
  const day = DAYS.includes(event.day) ? event.day : inferDayFromDate(event.start);
  const start = normalizeClock(event.start);
  const end = normalizeClock(event.end);
  if (!day || !start || !end || toMinutes(end) <= toMinutes(start)) return null;
  let projectId = event.projectId ? slugify(event.projectId) : "";
  if (projectId && !projectCollection.some((project) => project.id === projectId)) {
    projectId = "";
  }
  if (!projectId && event.projectName) {
    projectId = ensureProjectInCollection(projectCollection, event.projectName);
  }
  return { id: slugify(event.id || `event-${index + 1}`), title, day, start, end, projectId, fixed: event.fixed !== false, notes: String(event.notes || "").trim(), confidence: event.confidence ?? null };
}

function normalizeUrgency(value) {
  const normalized = String(value || "").toLowerCase();
  return ["high", "medium", "low"].includes(normalized) ? normalized : "";
}

function normalizeCadenceType(value) {
  const normalized = String(value || "").trim().toLowerCase();
  return ["once", "multiple", "routine"].includes(normalized) ? normalized : "";
}

function normalizeCadenceDays(value) {
  const parsed = Number.parseInt(String(value ?? "").trim(), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function parseLegacyRoutineCadence(value) {
  const normalized = String(value || "").trim().toLowerCase();
  if (!normalized) return null;
  const match = normalized.match(/^every\s+(\d+)\s+days?$/);
  if (match) return normalizeCadenceDays(match[1]);
  return null;
}

function deriveCadence(task) {
  let cadenceType = normalizeCadenceType(task?.cadenceType || task?.cadence || "");
  let cadenceDays = normalizeCadenceDays(task?.cadenceDays ?? task?.routineEveryDays ?? task?.repeatEveryDays ?? "");

  if (!cadenceType) {
    const parsedLegacyRoutine = parseLegacyRoutineCadence(task?.repeatCadence);
    if (cadenceDays || parsedLegacyRoutine) {
      cadenceType = "routine";
      cadenceDays = cadenceDays || parsedLegacyRoutine;
    } else if (task?.repeatUntilDone === true || String(task?.repeatCadence || "").trim()) {
      cadenceType = "multiple";
    } else {
      cadenceType = "once";
    }
  }

  if (cadenceType === "routine" && !cadenceDays) cadenceDays = 1;
  if (cadenceType !== "routine") cadenceDays = null;

  return { cadenceType, cadenceDays };
}

function getTaskCadenceType(task) {
  return normalizeCadenceType(task?.cadenceType) || "once";
}

function taskAllowsMultiplePlacements(task) {
  const cadenceType = getTaskCadenceType(task);
  return cadenceType === "multiple" || cadenceType === "routine";
}

function getSchedulingDaySequence() {
  const currentMarker = getCurrentMarker();
  const startIndex = currentMarker ? Math.max(0, DAYS.indexOf(currentMarker.day)) : 0;
  return DAYS.slice(startIndex);
}

function getRoutineTargetDays(task) {
  if (getTaskCadenceType(task) !== "routine") return [];
  const cadenceDays = normalizeCadenceDays(task.cadenceDays) || 1;
  return getSchedulingDaySequence().filter((_, index) => index % cadenceDays === 0);
}

function buildRoutineOutstandingByTask(completedTaskIds) {
  const outstandingByTask = new Map();
  state.tasks.forEach((task) => {
    if (completedTaskIds.has(task.id) || getTaskCadenceType(task) !== "routine") return;
    outstandingByTask.set(task.id, new Set(getRoutineTargetDays(task)));
  });
  return outstandingByTask;
}

function hasRemainingTaskNeed(task, unscheduledIds, routineOutstandingByTask) {
  const cadenceType = getTaskCadenceType(task);
  if (cadenceType === "routine") return Boolean(routineOutstandingByTask.get(task.id)?.size);
  return unscheduledIds.has(task.id);
}

  function onSettingsChange() {
    state.settings.dayStart = Number(els.dayStart.value);
    state.settings.dayEnd = Number(els.dayEnd.value);
    state.settings.useSystemTime = Boolean(els.useSystemTime.checked);
    state.weeklyContext.currentTime = normalizeDateTimeLocal(els.currentTime.value);
    if (!state.settings.useSystemTime && state.weeklyContext.currentTimeSource === "system") {
      state.weeklyContext.currentTimeSource = "manual";
    }
    applyCurrentTimeMode();
    buildAndRenderPlan();
  }

  function buildAndRenderPlan() {
    applyCurrentTimeMode();
    state.plan = buildPlan();
    renderAll();
    saveSession();
  }

function buildPlan() {
  const warnings = collectWarnings();
  const fixedEvents = getRenderableFixedEvents();
  const completedTaskIds = new Set(state.completedTaskIds);
  const unscheduledIds = new Set(state.tasks.filter((task) => !completedTaskIds.has(task.id)).map((task) => task.id));
  const routineOutstandingByTask = buildRoutineOutstandingByTask(completedTaskIds);
  const repeatTracker = new Map();
  const unlockPressure = buildUnlockPressureMap(completedTaskIds);
  const assignedSegments = [];
  const openSegments = [];
  let activePrompt = null;
  let promptLocked = false;
  const manualSegments = resolveManualPlacements(fixedEvents, warnings, unscheduledIds, completedTaskIds, repeatTracker, routineOutstandingByTask);
  assignedSegments.push(...manualSegments);
  const openWindows = buildOpenWindows([...fixedEvents, ...manualSegments]);
  const manualProgressSegments = [...manualSegments].sort(
    (left, right) =>
      DAYS.indexOf(left.day) - DAYS.indexOf(right.day) ||
      toMinutes(left.end) - toMinutes(right.end)
  );
  let manualProgressIndex = 0;
  let previousProjectId = "";

  openWindows.forEach((windowSlot) => {
    while (
      manualProgressIndex < manualProgressSegments.length &&
      segmentEndsBeforeOrAtWindowStart(manualProgressSegments[manualProgressIndex], windowSlot)
    ) {
      const progressedSegment = manualProgressSegments[manualProgressIndex];
      applyTaskProgress(progressedSegment.task, completedTaskIds, unscheduledIds, repeatTracker, routineOutstandingByTask, progressedSegment.day);
      previousProjectId = progressedSegment.task.projectId || previousProjectId;
      manualProgressIndex += 1;
    }

    let cursor = toMinutes(windowSlot.start);
    const endMin = toMinutes(windowSlot.end);

    if (promptLocked) {
      openSegments.push({ id: `${windowSlot.id}-future`, type: "open", day: windowSlot.day, start: fromMinutes(cursor), end: fromMinutes(endMin), durationMin: endMin - cursor, status: "future", windowId: windowSlot.id });
      return;
    }

    while (cursor < endMin) {
      const remainingMin = endMin - cursor;
      const candidates = rankTasksForWindow(windowSlot.day, remainingMin, completedTaskIds, unscheduledIds, repeatTracker, routineOutstandingByTask, previousProjectId, unlockPressure);
      if (!candidates.length) break;

      const promptId = `${windowSlot.id}::${fromMinutes(cursor)}`;
      const storedChoice = state.choices[promptId];
      if (storedChoice) {
        if (storedChoice === SKIP_VALUE) break;
        const chosen = candidates.find((candidate) => candidate.task.id === storedChoice);
        if (!chosen) {
          delete state.choices[promptId];
          continue;
        }
        assignedSegments.push(createAssignedSegment(chosen.task, windowSlot.day, cursor, "manual", windowSlot.id));
        cursor += chosen.task.estimateMin;
        previousProjectId = chosen.task.projectId;
        applyTaskProgress(chosen.task, completedTaskIds, unscheduledIds, repeatTracker, routineOutstandingByTask, windowSlot.day);
        continue;
      }

      const limit = Object.keys(state.choices).length ? 3 : 5;
      activePrompt = { promptId, day: windowSlot.day, start: fromMinutes(cursor), end: windowSlot.end, durationMin: endMin - cursor, windowId: windowSlot.id, suggestions: sliceSuggestions(candidates, limit) };
      promptLocked = true;
      break;
    }

    if (cursor < endMin) {
      openSegments.push({
        id: `${windowSlot.id}-${fromMinutes(cursor)}`,
        type: "open",
        day: windowSlot.day,
        start: fromMinutes(cursor),
        end: fromMinutes(endMin),
        durationMin: endMin - cursor,
        status: activePrompt && activePrompt.windowId === windowSlot.id && activePrompt.start === fromMinutes(cursor) ? "active" : (promptLocked ? "future" : "open"),
        windowId: windowSlot.id
      });
    }
  });

  const timelineByDay = Object.fromEntries(DAYS.map((day) => [day, []]));
  fixedEvents.forEach((event) => timelineByDay[event.day].push({ kind: "fixed", start: event.start, data: event }));
  assignedSegments.forEach((segment) => timelineByDay[segment.day].push({ kind: "assigned", start: segment.start, data: segment }));
  openSegments.forEach((segment) => timelineByDay[segment.day].push({ kind: "open", start: segment.start, data: segment }));
  const currentMarker = getCurrentMarker();
  if (currentMarker) timelineByDay[currentMarker.day].push({ kind: "now", start: currentMarker.time, data: currentMarker });
  DAYS.forEach((day) => timelineByDay[day].sort((left, right) => toMinutes(left.start) - toMinutes(right.start) || itemPriority(left.kind) - itemPriority(right.kind)));

  const anchorDiagnostics = buildProjectAnchorDiagnostics(fixedEvents, assignedSegments, unscheduledIds, completedTaskIds);
  warnings.push(...anchorDiagnostics.messages);

  return {
    warnings,
    fixedEvents,
    manualSegments,
    openWindows,
    assignedSegments,
    openSegments,
    activePrompt,
    timelineByDay,
    projectAnchors: anchorDiagnostics.projectAnchors,
      taskWarningsById: anchorDiagnostics.taskWarningsById,
      eventWarningsById: anchorDiagnostics.eventWarningsById,
      carryover: buildCarryoverBundle(state.tasks.filter((task) => hasRemainingTaskNeed(task, unscheduledIds, routineOutstandingByTask)))
    };
  }

function resolveManualPlacements(fixedEvents, warnings, unscheduledIds, completedTaskIds, repeatTracker, routineOutstandingByTask) {
  const placements = [...state.manualPlacements]
    .sort((left, right) => DAYS.indexOf(left.day) - DAYS.indexOf(right.day) || toMinutes(left.start) - toMinutes(right.start));
  const accepted = [];
  const occupied = fixedEvents.map((event) => ({ day: event.day, start: event.start, end: event.end, key: event.id }));

  placements.forEach((placement) => {
    const task = state.tasks.find((candidate) => candidate.id === placement.taskId);
    if (!task || !Number.isFinite(task.estimateMin) || task.estimateMin <= 0) {
      warnings.push(`A saved manual placement could not be used for ${placement.taskId}.`);
      return;
    }
    const end = fromMinutes(toMinutes(placement.start) + task.estimateMin);
    if (!canPlaceTaskAt(task, placement.day, placement.start, occupied, null)) {
      warnings.push(`Manual placement for "${task.title}" no longer fits and was skipped.`);
      return;
    }

    const segment = {
      id: `manual-${task.id}-${placement.day}-${placement.start}`,
      key: scheduledKey(task.id, placement.day, placement.start),
      day: placement.day,
      start: placement.start,
      end,
      durationMin: task.estimateMin,
      task,
      mode: "manual"
    };
    accepted.push(segment);
      occupied.push({ day: placement.day, start: placement.start, end, key: segment.id });
      const scheduledDays = repeatTracker.get(task.id) || new Set();
      scheduledDays.add(placement.day);
      repeatTracker.set(task.id, scheduledDays);
      if (getTaskCadenceType(task) === "routine") {
        routineOutstandingByTask.get(task.id)?.delete(placement.day);
      } else {
        unscheduledIds.delete(task.id);
      }
    });

  return accepted;
}

function rankTasksForWindow(day, remainingMin, completedTaskIds, unscheduledIds, repeatTracker, routineOutstandingByTask, preferredProjectId, unlockPressure) {
  return state.tasks
      .filter((task) => !completedTaskIds.has(task.id))
      .filter((task) => hasRemainingTaskNeed(task, unscheduledIds, routineOutstandingByTask))
      .filter((task) => task.actionable && Number.isFinite(task.estimateMin) && task.estimateMin > 0)
      .filter((task) => task.estimateMin <= remainingMin)
      .filter((task) => task.dependsOnIds.every((depId) => completedTaskIds.has(depId)))
      .filter((task) => {
        const scheduledDays = repeatTracker.get(task.id);
        if (scheduledDays?.has(day)) return false;
        return getTaskCadenceType(task) !== "routine" || routineOutstandingByTask.get(task.id)?.has(day);
      })
    .map((task) => ({ task, score: scoreTask(task, remainingMin, preferredProjectId, unlockPressure, day) }))
    .sort((left, right) => right.score - left.score || left.task.estimateMin - right.task.estimateMin || left.task.title.localeCompare(right.task.title));
}

function scoreTask(task, remainingMin, preferredProjectId, unlockPressure, day) {
  const fitScore = Math.max(0, 28 - Math.abs(remainingMin - task.estimateMin));
  const requiredBonus = task.optional ? -10 : 10;
  const projectBonus = preferredProjectId && preferredProjectId === task.projectId ? 12 : 0;
  const repeatPenalty = getTaskCadenceType(task) === "once" ? 0 : -4;
  const unlockBonus = Math.round((unlockPressure.get(task.id) || 0) * getEarlyWeekUnlockMultiplier(day) * 4.5);
  return (URGENCY_ORDER[task.urgency || ""] || 18) + fitScore + requiredBonus + projectBonus + repeatPenalty + unlockBonus;
}

function buildUnlockPressureMap(completedTaskIds) {
  const dependentsById = new Map(state.tasks.map((task) => [task.id, []]));
  state.tasks.forEach((task) => {
    task.dependsOnIds.forEach((dependencyId) => {
      if (dependentsById.has(dependencyId)) dependentsById.get(dependencyId).push(task.id);
    });
  });

  const memo = new Map();

  function getPressure(taskId, trail = new Set()) {
    if (memo.has(taskId)) return memo.get(taskId);
    if (trail.has(taskId)) return 0;
    trail.add(taskId);
    const outstandingDependents = (dependentsById.get(taskId) || []).filter((dependentId) => !completedTaskIds.has(dependentId));
    const pressure = outstandingDependents.reduce((sum, dependentId) => sum + 1.25 + (0.7 * getPressure(dependentId, trail)), 0);
    trail.delete(taskId);
    memo.set(taskId, pressure);
    return pressure;
  }

  state.tasks.forEach((task) => {
    if (!completedTaskIds.has(task.id)) getPressure(task.id);
  });

  return memo;
}

function getEarlyWeekUnlockMultiplier(day) {
  const currentMarker = getCurrentMarker();
  const anchorIndex = currentMarker ? Math.max(0, DAYS.indexOf(currentMarker.day)) : 0;
  const dayIndex = Math.max(0, DAYS.indexOf(day));
  const distance = Math.max(0, dayIndex - anchorIndex);
  return Math.max(0.5, 1.45 - (distance * 0.17));
}

function sliceSuggestions(candidates, limit) {
  if (candidates.length <= limit) return candidates;
  const cutoff = candidates[Math.min(limit - 1, candidates.length - 1)].score;
  return candidates.filter((candidate, index) => index < limit || candidate.score >= cutoff - 4).slice(0, Math.max(limit, 5));
}

function createAssignedSegment(task, day, startMin, mode, windowId, promptId = `${windowId}::${fromMinutes(startMin)}`) {
  return {
    id: `${windowId}-${task.id}-${fromMinutes(startMin)}`,
    key: scheduledKey(task.id, day, fromMinutes(startMin)),
    day,
    start: fromMinutes(startMin),
    end: fromMinutes(startMin + task.estimateMin),
    durationMin: task.estimateMin,
    task,
    mode,
    promptId
  };
}

function applyTaskProgress(task, completedTaskIds, unscheduledIds, repeatTracker, routineOutstandingByTask, day) {
  const scheduledDays = repeatTracker.get(task.id) || new Set();
  scheduledDays.add(day);
  repeatTracker.set(task.id, scheduledDays);

  if (getTaskCadenceType(task) === "routine") {
    routineOutstandingByTask.get(task.id)?.delete(day);
    return;
  }

  unscheduledIds.delete(task.id);
  if (getTaskCadenceType(task) === "once") {
    completedTaskIds.add(task.id);
  }
}

function segmentEndsBeforeOrAtWindowStart(segment, windowSlot) {
  const segmentDayIndex = DAYS.indexOf(segment.day);
  const windowDayIndex = DAYS.indexOf(windowSlot.day);
  if (segmentDayIndex < windowDayIndex) return true;
  if (segmentDayIndex > windowDayIndex) return false;
  return toMinutes(segment.end) <= toMinutes(windowSlot.start);
}

function buildOpenWindows(fixedEvents) {
  const currentMarker = getCurrentMarker();
  const dayStartMin = state.settings.dayStart * 60;
  const dayEndMin = state.settings.dayEnd * 60;
  const usableEvents = fixedEvents.map((event) => clipEventToHorizon(event, dayStartMin, dayEndMin, currentMarker)).filter(Boolean);
  const windows = [];

  DAYS.forEach((day) => {
    if (currentMarker && DAYS.indexOf(day) < DAYS.indexOf(currentMarker.day)) return;
    let cursor = dayStartMin;
    if (currentMarker && day === currentMarker.day) cursor = Math.max(cursor, currentMarker.minutes);
    if (cursor >= dayEndMin) return;

    usableEvents.filter((event) => event.day === day).sort(compareEvents).forEach((event) => {
      const startMin = toMinutes(event.start);
      const endMin = toMinutes(event.end);
      if (startMin > cursor) windows.push(makeWindow(day, cursor, startMin));
      cursor = Math.max(cursor, endMin);
    });

    if (cursor < dayEndMin) windows.push(makeWindow(day, cursor, dayEndMin));
  });

  return windows.filter((windowSlot) => windowSlot.durationMin > 0);
}

function getRenderableFixedEvents() {
  const currentMarker = getCurrentMarker();
  const dayStartMin = state.settings.dayStart * 60;
  const dayEndMin = state.settings.dayEnd * 60;
  const hiddenIds = new Set(state.hiddenFixedEventIds);
  return state.calendarEvents.filter((event) => !hiddenIds.has(event.id)).filter(isUsableEvent).map((event) => clipEventToHorizon(event, dayStartMin, dayEndMin, currentMarker)).filter(Boolean).sort(compareEvents);
}

function clipEventToHorizon(event, dayStartMin, dayEndMin, currentMarker) {
  if (currentMarker && DAYS.indexOf(event.day) < DAYS.indexOf(currentMarker.day)) return null;
  let startMin = Math.max(toMinutes(event.start), dayStartMin);
  let endMin = Math.min(toMinutes(event.end), dayEndMin);
  if (currentMarker && event.day === currentMarker.day) {
    if (endMin <= currentMarker.minutes) return null;
    startMin = Math.max(startMin, currentMarker.minutes);
  }
  if (endMin <= startMin) return null;
  return { ...event, start: fromMinutes(startMin), end: fromMinutes(endMin) };
}

function getCurrentMarker() {
  const raw = normalizeDateTimeLocal(state.weeklyContext.currentTime);
  if (!raw) return null;
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return null;
  return { raw, day: DAYS[(date.getDay() + 6) % 7], time: `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`, minutes: date.getHours() * 60 + date.getMinutes() };
}

function collectWarnings() {
  const warnings = [];
  if (!state.tasks.length && !state.calendarEvents.length) warnings.push("Import a bundle to populate the board.");
  if (state.settings.dayEnd <= state.settings.dayStart) warnings.push("Day end should be after day start.");
  const missingEstimates = state.tasks.filter((task) => task.estimateMin === null);
  if (missingEstimates.length) warnings.push(`${missingEstimates.length} task${missingEstimates.length === 1 ? "" : "s"} still need estimates and cannot be scheduled yet.`);
  const brokenDeps = state.tasks.filter((task) => task.dependsOnIds.some((depId) => !state.tasks.some((candidate) => candidate.id === depId)));
  if (brokenDeps.length) warnings.push("Some tasks depend on IDs that are no longer present.");
  if (!state.weeklyContext.currentTime) warnings.push("No current-time marker is loaded, so the board uses the full day horizon.");
  return warnings;
}

function compareDayTime(dayA, timeA, dayB, timeB) {
  return DAYS.indexOf(dayA) - DAYS.indexOf(dayB) || toMinutes(timeA) - toMinutes(timeB);
}

function formatDayTimeLabel(day, time) {
  return `${day} ${prettyTime(time)}`;
}

function tokenizeAnchorText(value) {
  return String(value || "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length >= 3 && !["the", "and", "for", "with", "this", "that", "from", "your"].includes(token));
}

function getVisibleWeekBounds() {
  const source = state.weeklyContext.currentTime || new Date().toISOString();
  const date = new Date(source);
  if (Number.isNaN(date.getTime())) return null;
  const day = date.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const weekStart = new Date(date.getFullYear(), date.getMonth(), date.getDate() + mondayOffset, 0, 0, 0, 0);
  const weekEnd = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + 6, 23, 59, 59, 999);
  return { weekStart, weekEnd };
}

function deadlineToAnchorTarget(deadline, index) {
  const due = String(deadline?.due || "").trim();
  if (!due) return null;
  let date = null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(due)) {
    const [year, month, day] = due.split("-").map(Number);
    date = new Date(year, month - 1, day, 23, 59, 0, 0);
  } else {
    date = new Date(due);
  }
  if (!date || Number.isNaN(date.getTime())) return null;

  const bounds = getVisibleWeekBounds();
  if (bounds && (date < bounds.weekStart || date > bounds.weekEnd)) return null;

  const weekdayIndex = date.getDay();
  const dayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][weekdayIndex];
  if (!DAYS.includes(dayName)) return null;

  return {
    id: `deadline-${index + 1}`,
    title: String(deadline.label || "Deadline").trim(),
    day: dayName,
    start: fromMinutes(date.getHours() * 60 + date.getMinutes()),
    kind: "deadline"
  };
}

function buildAnchorTargets(fixedEvents) {
  const targets = fixedEvents.map((event) => ({
    id: event.id,
    title: event.title,
    day: event.day,
    start: event.start,
    projectId: event.projectId || "",
    notes: event.notes || "",
    kind: "event"
  }));
  return targets.sort((left, right) => compareDayTime(left.day, left.start, right.day, right.start));
}

function scoreTaskAgainstAnchor(task, anchorTarget) {
  const taskText = `${task.title || ""} ${task.notes || ""}`.toLowerCase();
  const taskTokens = tokenizeAnchorText(taskText);
  const anchorText = `${anchorTarget.title || ""} ${anchorTarget.notes || ""}`.toLowerCase();
  const anchorTokens = tokenizeAnchorText(anchorText);
  const taskTokenSet = new Set(taskTokens);
  let score = 0;

  anchorTokens.forEach((token) => {
    if (taskTokenSet.has(token) || taskText.includes(token)) score += token.length >= 5 ? 3 : 2;
  });

  const prepKeywords = [
    "party", "invite", "invites", "flyer", "food", "drinks", "drink", "shop", "shopping",
    "buy", "clean", "setup", "set up", "plan", "prep", "prepare", "reminder", "attendance",
    "campus", "completos", "rental", "rent", "car", "arrival", "arrive", "visit", "office", "hours"
  ];
  prepKeywords.forEach((keyword) => {
    if (taskText.includes(keyword) && anchorTokens.some((token) => token.includes(keyword) || keyword.includes(token))) score += 2;
  });

  if (anchorTarget.kind === "event" && task.projectId && anchorTarget.projectId === task.projectId && score > 0) score += 1;
  if (taskText.includes("arriv") && anchorTokens.some((token) => token.includes("arriv") || token.includes("launch") || token.includes("demo"))) score += 3;
  if ((taskText.includes("rent") || taskText.includes("rental") || taskText.includes("car") || taskText.includes("travel")) && anchorTokens.some((token) => ["visit", "arrival", "arrives", "trip", "travel"].includes(token))) score += 5;
  if ((taskText.includes("launch") || taskText.includes("email") || taskText.includes("demo")) && anchorTokens.some((token) => ["launch", "demo", "workshop"].includes(token))) score += 3;
  if ((taskText.includes("reminder") || taskText.includes("snacks") || taskText.includes("setup") || taskText.includes("room")) && anchorTokens.some((token) => ["team", "demo", "workshop", "session"].includes(token))) score += 3;

  return score;
}

function buildProjectAnchorDiagnostics(fixedEvents, assignedSegments, unscheduledIds, completedTaskIds) {
  const projectAnchors = {};
  const taskWarningsById = {};
  const eventWarningsById = {};
  const messages = [];
  const anchorTargets = buildAnchorTargets(fixedEvents);
  const taskAnchorOverrides = state.taskAnchorOverrides || {};
  const projectTasksById = new Map(
    state.projects.map((project) => [
      project.id,
      state.tasks.filter((task) =>
        task.projectId === project.id &&
        task.actionable !== false &&
        getTaskCadenceType(task) === "once"
      )
    ])
  );

  state.projects.forEach((project) => {
    projectAnchors[project.id] = [];
  });

  anchorTargets.forEach((target) => {
    let bestProjectId = "";
    let bestMatches = [];
    let bestTotal = 0;
    const forcedProjects = new Map();

    state.projects.forEach((project) => {
      const forcedTasks = (projectTasksById.get(project.id) || []).filter((task) => taskAnchorOverrides[task.id] === target.id);
      if (forcedTasks.length) forcedProjects.set(project.id, forcedTasks);
    });

    if (forcedProjects.size) {
      forcedProjects.forEach((forcedTasks, projectId) => {
        const otherMatches = (projectTasksById.get(projectId) || [])
          .filter((task) => !forcedTasks.some((forcedTask) => forcedTask.id === task.id))
          .map((task) => ({ task, score: scoreTaskAgainstAnchor(task, target) }))
          .filter(({ score }) => score >= 4)
          .sort((left, right) => right.score - left.score || left.task.title.localeCompare(right.task.title));
        const forcedMatches = forcedTasks.map((task) => ({ task, score: 99 }));
        const combinedMatches = [...forcedMatches, ...otherMatches];
        const totalScore = combinedMatches.reduce((sum, match) => sum + match.score, 0) + 10;
        if (totalScore > bestTotal) {
          bestTotal = totalScore;
          bestProjectId = projectId;
          bestMatches = combinedMatches;
        }
      });
    }

    state.projects.forEach((project) => {
      if (forcedProjects.size) return;
      const matches = (projectTasksById.get(project.id) || [])
        .map((task) => ({ task, score: scoreTaskAgainstAnchor(task, target) }))
        .filter(({ score }) => score >= 4)
        .sort((left, right) => right.score - left.score || left.task.title.localeCompare(right.task.title));

      if (!matches.length) return;

      const totalScore = matches.reduce((sum, match) => sum + match.score, 0) + (matches.length > 1 ? 2 : 0);
      if (totalScore > bestTotal) {
        bestTotal = totalScore;
        bestProjectId = project.id;
        bestMatches = matches;
      }
    });

    if (!bestProjectId || bestTotal < 7) return;

    const project = state.projects.find((entry) => entry.id === bestProjectId);
    const anchorEntry = {
      id: target.id,
      title: target.title,
      day: target.day,
      start: target.start,
      kind: target.kind,
      projectId: target.projectId || bestProjectId,
      linkedTaskIds: bestMatches.map((match) => match.task.id),
      warningCount: 0,
      message: ""
    };

    bestMatches.forEach(({ task }) => {
      const taskSegments = assignedSegments
        .filter((segment) => segment.task.id === task.id)
        .sort((left, right) => compareDayTime(left.day, left.start, right.day, right.start));

      let warning = null;
      if (taskSegments.length) {
        const firstSegment = taskSegments[0];
        const taskEndsAfterAnchor = compareDayTime(firstSegment.day, firstSegment.end, target.day, target.start) > 0;
        if (taskEndsAfterAnchor) {
          warning = {
            type: "anchor-late",
            anchorId: target.id,
            message: `"${task.title}" is placed after ${target.title}.`
          };
        }
      }

      if (warning) {
        taskWarningsById[task.id] = warning;
        anchorEntry.warningCount += 1;
      }
    });

    const message = anchorEntry.warningCount
      ? `${anchorEntry.warningCount} task${anchorEntry.warningCount === 1 ? "" : "s"} in ${project?.name || "this category"} should happen before ${target.title}.`
      : "";
    if (message) {
      messages.push(message);
      eventWarningsById[target.id] = {
        count: anchorEntry.warningCount,
        message
      };
    }

    projectAnchors[bestProjectId].push({
      ...anchorEntry,
      hasWarnings: anchorEntry.warningCount > 0,
      message
    });
  });

  state.projects.forEach((project) => {
    projectAnchors[project.id] = (projectAnchors[project.id] || [])
      .sort((left, right) => compareDayTime(left.day, left.start, right.day, right.start));
  });

  return { projectAnchors, taskWarningsById, eventWarningsById, messages };
}

function buildCarryoverBundle(tasks) {
  return {
    projects: state.projects,
    tasks: tasks.map((task) => ({ id: task.id, title: task.title, projectId: task.projectId, estimateMin: task.estimateMin, urgency: task.urgency || null, actionable: task.actionable, dependsOnIds: task.dependsOnIds, notes: task.notes, optional: task.optional, cadenceType: task.cadenceType || "once", cadenceDays: task.cadenceType === "routine" ? task.cadenceDays || 1 : undefined })),
    calendar_events: [],
    weekly_context: { deadlines: state.weeklyContext.deadlines, notes: tasks.length ? `Carryover created from ${tasks.length} unscheduled task${tasks.length === 1 ? "" : "s"}. ${state.weeklyContext.notes || ""}`.trim() : "No carryover tasks remain.", preferences: state.weeklyContext.preferences, currentTime: "", timezone: state.weeklyContext.timezone || "" }
  };
}

function renderAll() {
  renderImportStatus();
  renderProjectOptions();
  renderScreenshotPreview();
  renderVisionPrompt();
  renderStats();
  renderWarnings();
  renderTaskSummary();
  renderFocusWindow();
  renderPlannerBoard();
  renderCarryover();
  renderEventsEditor();
  renderTasksEditor();
  renderDetailsVisibility();
  renderImportPanelState();
  renderBoardControls();
  renderTaskSummaryPlacement();
  renderImportPriorityState();
  syncInputValues();
}

function renderImportStatus() {
  els.importStatus.textContent = state.importStatus;
  els.importStatus.className = `status ${state.importStatusTone || ""}`.trim();
}

function hasParsedPlannerData() {
  return state.tasks.length > 0 || state.calendarEvents.length > 0;
}

function hydrateDayOptions() {
  if (!els.eventDay) return;
  els.eventDay.innerHTML = DAYS.map((day) => `<option value="${day}">${day}</option>`).join("");
}

function renderProjectOptions() {
  const options = state.projects.map((project) => `<option value="${escapeHtml(project.id)}">${escapeHtml(project.name)}</option>`).join("");
  els.eventProject.innerHTML = `<option value="">Uncategorized</option>${options}`;
}

function renderScreenshotPreview() {
  if (!state.screenshotDataUrl) {
    els.screenshotPreview.className = "screenshot-preview empty";
    els.screenshotPreview.innerHTML = "<p>No screenshot uploaded yet.</p>";
    return;
  }
  els.screenshotPreview.className = "screenshot-preview";
  els.screenshotPreview.innerHTML = `<img alt="Calendar screenshot preview" src="${state.screenshotDataUrl}" />`;
}

function renderVisionPrompt() {
  const categories = state.projects.length ? state.projects.map((project) => project.name).join(", ") : "No categories loaded yet";
  els.visionPrompt.value = [
    "Read this weekly calendar screenshot and return JSON only.",
    "Extract fixed events and the current-time indicator if visible.",
    '{ "currentTime": "YYYY-MM-DDTHH:MM"|null, "events": [{ "title": string, "day": "Monday"|"Tuesday"|"Wednesday"|"Thursday"|"Friday"|"Saturday"|"Sunday", "start": "HH:MM", "end": "HH:MM", "projectName": string|null, "notes": string|null }] }',
    `Prefer these existing categories when possible: ${categories}.`,
    "If the current-time marker is unclear, set currentTime to null and mention the uncertainty in notes."
  ].join("\n");
}

function renderStats() {
  const taskCount = state.tasks.length;
  const fixedCount = state.plan?.fixedEvents.length || state.calendarEvents.length;
  const openCount = state.plan?.openWindows.length || 0;
  const scheduledCount = new Set((state.plan?.assignedSegments || []).map((segment) => segment.task.id)).size;
  const completedCount = state.completedTaskIds.length;
  els.statsStrip.innerHTML = [
    statCard("Fixed Events", fixedCount),
    statCard("Open Windows", openCount),
    statCard("Tasks", taskCount),
    statCard("Tasks Scheduled", scheduledCount),
    statCard("Tasks Done", completedCount)
  ].join("");
}

function statCard(label, value) {
  return `<article class="stat-card"><span class="eyebrow">${label}</span><strong>${value}</strong></article>`;
}

function renderWarnings() {
  const warnings = state.plan?.warnings || collectWarnings();
  els.warnings.innerHTML = warnings.map((warning) => `<div class="warning">${escapeHtml(warning)}</div>`).join("");
}

  function renderTaskSummary() {
    if (!state.tasks.length) {
      renderTaskSummaryGuide();
      els.taskSummary.innerHTML = '<article class="empty-card">Import a bundle to see categories, estimates, and the remaining work at a glance.</article>';
    return;
  }
  renderTaskSummaryGuide();
  const manuallyPlacedIds = new Set((state.plan?.manualSegments || []).map((segment) => segment.task.id));
  const completedIds = new Set(state.completedTaskIds);
  const projectAnchors = state.plan?.projectAnchors || {};
  const taskWarningsById = state.plan?.taskWarningsById || {};
  const groups = state.projects
      .map((project) => ({ project, tasks: state.tasks.filter((task) => task.projectId === project.id) }))
      .filter(({ project, tasks }) => tasks.length || state.userCreatedProjectIds.includes(project.id));
      els.taskSummary.innerHTML = groups.map(({ project, tasks }) => `
        <article class="summary-card" data-project-id="${escapeHtml(project.id)}">
        <div class="summary-card-head">
          <button type="button" class="project-chip ${(state.renameCategoryMode || state.addTaskMode) ? "is-rename-target" : ""}" data-action="rename-project-select" data-project-id="${escapeHtml(project.id)}" style="--chip-color:${getProjectColor(project.id)};" title="${state.addTaskMode ? `Add task to ${escapeAttribute(project.name)}` : state.renameCategoryMode ? `Rename ${escapeAttribute(project.name)}` : escapeAttribute(project.name)}" aria-label="${state.addTaskMode ? `Add task to ${escapeAttribute(project.name)}` : state.renameCategoryMode ? `Rename ${escapeAttribute(project.name)}` : escapeAttribute(project.name)}">${escapeHtml(project.name)}</button>
            <div class="summary-card-actions">
            <button type="button" class="summary-icon-button" data-action="add-summary-task" data-project-id="${escapeHtml(project.id)}" title="Add task to ${escapeAttribute(project.name)}" aria-label="Add task to ${escapeAttribute(project.name)}">➕</button>
            <button type="button" class="summary-icon-button" data-action="rename-project" data-project-id="${escapeHtml(project.id)}" title="Rename ${escapeAttribute(project.name)}" aria-label="Rename ${escapeAttribute(project.name)}">✏️</button>
            ${tasks.length === 0 ? `<button type="button" class="summary-icon-button danger" data-action="delete-project" data-project-id="${escapeHtml(project.id)}" title="Delete empty category ${escapeAttribute(project.name)}" aria-label="Delete empty category ${escapeAttribute(project.name)}">✕</button>` : ""}
          </div>
          </div>
          <h4>${tasks.length} task${tasks.length === 1 ? "" : "s"}</h4>
          ${state.summaryView === "list" && tasks.length ? renderProjectListRollup(tasks, completedIds) : ""}
          ${tasks.length ? renderProjectTaskSections(tasks, project, projectAnchors[project.id] || [], manuallyPlacedIds, completedIds, taskWarningsById) : '<p class="muted small-copy">Drop a task here or add one to start this category.</p>'}
          ${tasks.length > 4 ? `<div class="summary-card-footer"><button type="button" class="ghost small" data-action="toggle-project-expand" data-project-id="${escapeHtml(project.id)}">${state.expandedProjectIds.includes(project.id) ? "Show Less" : `Show ${tasks.length - 4} More`}</button></div>` : ""}
          </article>
        `).join("");
      }

function renderProjectListRollup(tasks, completedIds) {
  const totalMinutes = tasks.reduce((sum, task) => sum + (Number.isFinite(task.estimateMin) ? task.estimateMin : 0), 0);
  const doneMinutes = tasks.reduce((sum, task) => sum + (completedIds.has(task.id) && Number.isFinite(task.estimateMin) ? task.estimateMin : 0), 0);
  const percent = totalMinutes > 0 ? Math.round((doneMinutes / totalMinutes) * 100) : 0;
  return `<div class="summary-rollup">
    <span class="summary-rollup-pill">Estimated ${escapeHtml(formatMinutesAsHours(totalMinutes))}</span>
    <span class="summary-rollup-pill">${escapeHtml(`${doneMinutes}m / ${totalMinutes}m`)}</span>
    <span class="summary-rollup-pill">${escapeHtml(`${percent}% done`)}</span>
  </div>`;
}

function formatMinutesAsHours(totalMinutes) {
  if (!Number.isFinite(totalMinutes) || totalMinutes <= 0) return "0h";
  const hours = totalMinutes / 60;
  return Number.isInteger(hours) ? `${hours}h` : `${hours.toFixed(1)}h`;
}

  function onTaskSummaryClick(event) {
      const button = event.target.closest("button[data-action]");
      if (!button) return;
    if (button.dataset.action === "tree-select-task") {
      handleTreeSelection(button.dataset.taskId);
      return;
    }
    if (button.dataset.action === "time-edit-task") {
      handleTimeEditSelection(button.dataset.taskId);
      return;
    }
      if (button.dataset.action === "deadline-select-task") {
        handleDeadlineSelection(button.dataset.taskId);
        return;
      }
      if (button.dataset.action === "optional-select-task") {
        handleOptionalSelection(button.dataset.taskId);
        return;
      }
      if (button.dataset.action === "delete-task-select") {
        handleDeleteTaskSelection(button.dataset.taskId);
        return;
      }
      if (button.dataset.action === "toggle-task-complete") {
        toggleTaskComplete(button.dataset.taskId);
        return;
      }
  if (button.dataset.action === "toggle-project-expand") {
    toggleProjectExpansion(button.dataset.projectId);
    return;
  }
    if (button.dataset.action === "add-summary-task") {
      addTaskFromSummary(button.dataset.projectId);
      return;
    }
    if (button.dataset.action === "delete-project") {
      deleteEmptyProject(button.dataset.projectId);
      return;
    }
    if (button.dataset.action === "rename-project-select") {
      if (state.addTaskMode) {
        addTaskFromSummary(button.dataset.projectId);
        return;
      }
      if (state.renameCategoryMode) {
        renameProject(button.dataset.projectId);
        return;
      }
      return;
    }
    if (button.dataset.action === "rename-project") {
      renameProject(button.dataset.projectId);
    }
  }

function renderFocusWindow() {
  if (!state.plan) {
    els.focusWindow.className = "focus-window empty";
    els.focusWindow.innerHTML = "<p>Import a bundle to unlock the next scheduling decision.</p>";
    return;
  }
  const prompt = state.plan.activePrompt;
  if (!prompt) {
    const remainingCount = state.plan.carryover?.tasks?.length || 0;
    els.focusWindow.className = "focus-window";
    els.focusWindow.innerHTML = `<p class="focus-title">No pending choice right now.</p><p class="focus-subtitle">${remainingCount ? `There are still ${remainingCount} remaining task${remainingCount === 1 ? "" : "s"}. You can restart from the first open window and do another pass.` : "There are no remaining scheduling prompts right now. Open Review &amp; Edit if you want to tweak estimates or fixed events."}</p>${remainingCount ? '<div class="slot-action"><button class="secondary small" data-action="restart-pass">Start Another Pass</button></div>' : ""}`;
    return;
  }
  els.focusWindow.className = "focus-window";
  els.focusWindow.innerHTML = `
    <p class="focus-title">${escapeHtml(prompt.day)} · ${prettyTime(prompt.start)} to ${prettyTime(prompt.end)}</p>
    <p class="focus-subtitle">Pick what should go first in this free window. The planner will then keep filling any leftover time before moving on.</p>
    <div class="candidate-row">
      ${prompt.suggestions.map(({ task, score }) => `
        <article class="candidate-card" draggable="true" data-task-id="${escapeHtml(task.id)}" data-drag-source="focus" title="${escapeAttribute(task.title)}">
          <strong>${escapeHtml(task.title)}</strong>
          <p>${escapeHtml(getProjectName(task.projectId) || "Uncategorized")} · ${task.estimateMin}m · ${escapeHtml(task.urgency || "unspecified urgency")}</p>
          <p>Fit score ${Math.round(score)}</p>
          <button class="primary small" data-action="choose-task" data-prompt-id="${escapeHtml(prompt.promptId)}" data-task-id="${escapeHtml(task.id)}">Place This Task</button>
        </article>
      `).join("")}
    </div>
    <div class="slot-action"><button class="ghost small" data-action="skip-window" data-prompt-id="${escapeHtml(prompt.promptId)}">Leave This Window Open</button></div>
  `;
}

function renderPlannerBoard() {
  if (!state.plan) {
    els.plannerBoard.className = "planner-board empty";
    els.plannerBoard.innerHTML = "<p>Import a bundle to see fixed events, available windows, and the next scheduling decision.</p>";
    return;
  }
  if (state.boardView === "calendar") {
    renderCalendarBoard();
    return;
  }
  renderListBoard();
}

function renderListBoard() {
  els.plannerBoard.className = "planner-board list-board";
  els.plannerBoard.innerHTML = DAYS.map((day) => `
    <section class="day-column">
      <header class="day-header"><span class="eyebrow">Week View</span><strong>${escapeHtml(day)}</strong></header>
      ${(state.plan.timelineByDay[day] || []).length
        ? state.plan.timelineByDay[day].map((item) => renderTimelineItem(item.kind, item.data)).join("")
        : '<div class="empty-card">No remaining fixed events or open time here.</div>'}
    </section>
  `).join("");
}

function renderCalendarBoard() {
  const dayStartMin = state.settings.dayStart * 60;
  const dayEndMin = state.settings.dayEnd * 60;
  const totalMinutes = Math.max(60, dayEndMin - dayStartMin);
  const pixelsPerMinute = 1.1;
  const bodyHeight = Math.round(totalMinutes * pixelsPerMinute);
  const currentMarker = getCurrentMarker();

  const axisLines = buildHourLines(dayStartMin, dayEndMin, pixelsPerMinute);
  const axisLabels = buildHourLabels(dayStartMin, dayEndMin, pixelsPerMinute);

  els.plannerBoard.className = "planner-board calendar-board";
  els.plannerBoard.innerHTML = `
    <div class="calendar-shell">
      <div class="calendar-grid">
        <section class="calendar-axis">
          <header class="calendar-axis-header">Time</header>
          <div class="calendar-axis-body" style="height:${bodyHeight}px;">
            ${axisLines}
            ${axisLabels}
          </div>
        </section>
        ${DAYS.map((day) => renderCalendarDay(day, bodyHeight, dayStartMin, dayEndMin, pixelsPerMinute, currentMarker)).join("")}
      </div>
    </div>
  `;
}

function renderCalendarDay(day, bodyHeight, dayStartMin, dayEndMin, pixelsPerMinute, currentMarker) {
  const blockedTop = currentMarker && day === currentMarker.day ? Math.max(0, currentMarker.minutes - dayStartMin) * pixelsPerMinute : 0;
  const items = (state.plan.timelineByDay[day] || [])
    .map((item) => renderCalendarItem(item.kind, item.data, dayStartMin, dayEndMin, pixelsPerMinute))
    .join("");

  return `
    <section class="calendar-day">
      <header class="calendar-day-header"><span class="eyebrow">Week View</span><strong>${escapeHtml(day)}</strong></header>
      <div class="calendar-day-body" data-drop-day="${escapeHtml(day)}" style="height:${bodyHeight}px;">
        ${buildHourLines(dayStartMin, dayEndMin, pixelsPerMinute)}
        ${blockedTop ? `<div class="calendar-blocked" style="height:${blockedTop}px;"></div>` : ""}
        ${items}
      </div>
    </section>
  `;
}

function renderCalendarItem(kind, item, dayStartMin, dayEndMin, pixelsPerMinute) {
  if (kind === "now") {
    const top = (item.minutes - dayStartMin) * pixelsPerMinute;
    return `<div class="calendar-item now-line" style="top:${top}px;"></div>`;
  }

  const startMin = Math.max(dayStartMin, toMinutes(item.start));
  const endMin = Math.min(dayEndMin, toMinutes(item.end));
  if (endMin <= startMin) return "";
  const top = (startMin - dayStartMin) * pixelsPerMinute;
  const height = Math.max(20, (endMin - startMin) * pixelsPerMinute);

  if (kind === "fixed") {
    const color = getProjectColor(item.projectId);
    const eventWarning = state.plan?.eventWarningsById?.[item.id];
    return `<article class="calendar-item fixed${eventWarning ? " has-warning" : ""}" title="${escapeAttribute(buildItemTooltip(item.title, item.start, item.end, getProjectName(item.projectId) || "Uncategorized", eventWarning?.message || item.notes || ""))}" style="top:${top}px;height:${height}px;--item-color:${color};--item-bg:${hexToRgba(color, 0.24)};--item-border:${hexToRgba(color, 0.45)};"><button type="button" class="item-delete-button fixed-delete" data-action="hide-fixed-event" data-event-id="${escapeHtml(item.id)}">✕</button>${eventWarning ? `<span class="item-warning-badge" title="${escapeAttribute(eventWarning.message)}" aria-label="${escapeAttribute(eventWarning.message)}">⚠️</span>` : ""}<p class="calendar-item-title">${escapeHtml(item.title)}</p><p class="calendar-item-meta">${prettyTime(item.start)} - ${prettyTime(item.end)}</p></article>`;
  }

  if (kind === "assigned") {
    const color = getProjectColor(item.task.projectId);
    const completedClass = isTaskCompleted(item.task.id) ? " is-complete" : "";
    const taskWarning = state.plan?.taskWarningsById?.[item.task.id];
    return `<article class="calendar-item assigned${completedClass}${taskWarning ? " has-warning" : ""}" title="${escapeAttribute(buildItemTooltip(item.task.title, item.start, item.end, getProjectName(item.task.projectId) || "Uncategorized", taskWarning?.message || "Chosen manually."))}" style="top:${top}px;height:${height}px;--item-color:${color};--item-bg:${hexToRgba(color, 0.24)};--item-border:${hexToRgba(color, 0.45)};"><button type="button" class="item-delete-button" data-action="delete-scheduled-task" data-task-id="${escapeHtml(item.task.id)}" data-day="${escapeHtml(item.day)}" data-start="${escapeHtml(item.start)}">✕</button>${taskWarning ? `<span class="item-warning-badge" title="${escapeAttribute(taskWarning.message)}" aria-label="${escapeAttribute(taskWarning.message)}">⚠️</span>` : ""}<div class="item-shift-controls"><button type="button" class="shift-button" data-action="nudge-task" data-task-id="${escapeHtml(item.task.id)}" data-day="${escapeHtml(item.day)}" data-start="${escapeHtml(item.start)}" data-direction="-15">▲</button><button type="button" class="shift-button" data-action="nudge-task" data-task-id="${escapeHtml(item.task.id)}" data-day="${escapeHtml(item.day)}" data-start="${escapeHtml(item.start)}" data-direction="15">▼</button></div><p class="calendar-item-title">${escapeHtml(item.task.title)}</p><p class="calendar-item-meta">${prettyTime(item.start)} - ${prettyTime(item.end)} · chosen${isTaskCompleted(item.task.id) ? " · done" : ""}</p></article>`;
  }

  const prompt = state.plan?.activePrompt;
  const isActive = item.status === "active" && prompt && prompt.windowId === item.windowId;
  const openTitle = isActive ? "Current open window" : item.status === "future" ? "Later open window" : "Open time";
  const openNotes = isActive ? prompt.suggestions.slice(0, 3).map(({ task }) => task.title).join(", ") : "";
  return `<article class="calendar-item open" title="${escapeAttribute(buildItemTooltip(openTitle, item.start, item.end, "Available time", openNotes))}" style="top:${top}px;height:${height}px;"><p class="calendar-item-title">${openTitle}</p><p class="calendar-item-meta">${prettyTime(item.start)} - ${prettyTime(item.end)}${isActive ? `<br>${prompt.suggestions.slice(0, 3).map(({ task }) => escapeHtml(task.title)).join("<br>")}` : ""}</p></article>`;
}

function buildHourLines(dayStartMin, dayEndMin, pixelsPerMinute) {
  const lines = [];
  for (let current = dayStartMin; current <= dayEndMin; current += 60) {
    const top = (current - dayStartMin) * pixelsPerMinute;
    lines.push(`<div class="hour-line" style="top:${top}px;"></div>`);
  }
  return lines.join("");
}

function buildHourLabels(dayStartMin, dayEndMin, pixelsPerMinute) {
  const labels = [];
  for (let current = dayStartMin; current <= dayEndMin; current += 60) {
    const top = (current - dayStartMin) * pixelsPerMinute;
    labels.push(`<div class="time-tick" style="top:${top}px;">${prettyTime(fromMinutes(current))}</div>`);
  }
  return labels.join("");
}

function renderTimelineItem(kind, item) {
  if (kind === "fixed") {
    const color = getProjectColor(item.projectId);
    const eventWarning = state.plan?.eventWarningsById?.[item.id];
    return `<article class="timeline-item fixed${eventWarning ? " has-warning" : ""}" title="${escapeAttribute(buildItemTooltip(item.title, item.start, item.end, getProjectName(item.projectId) || "Uncategorized", eventWarning?.message || item.notes || ""))}" style="--item-color:${color};--item-bg:${hexToRgba(color, 0.18)};--item-border:${hexToRgba(color, 0.34)};"><button type="button" class="item-delete-button fixed-delete" data-action="hide-fixed-event" data-event-id="${escapeHtml(item.id)}">✕</button>${eventWarning ? `<span class="item-warning-badge" title="${escapeAttribute(eventWarning.message)}" aria-label="${escapeAttribute(eventWarning.message)}">⚠️</span>` : ""}<div class="time-label">${prettyTime(item.start)} - ${prettyTime(item.end)}</div><p class="item-title">${escapeHtml(item.title)}</p><p class="item-meta">${escapeHtml(getProjectName(item.projectId) || "Uncategorized")}</p></article>`;
  }
  if (kind === "assigned") {
    const color = getProjectColor(item.task.projectId);
    const completedClass = isTaskCompleted(item.task.id) ? " is-complete" : "";
    const taskWarning = state.plan?.taskWarningsById?.[item.task.id];
    return `<article class="timeline-item slot${completedClass}${taskWarning ? " has-warning" : ""}" title="${escapeAttribute(buildItemTooltip(item.task.title, item.start, item.end, getProjectName(item.task.projectId) || "Uncategorized", taskWarning?.message || "Chosen manually."))}" style="--item-color:${color};--item-bg:${hexToRgba(color, 0.18)};--item-border:${hexToRgba(color, 0.34)};"><button type="button" class="item-delete-button" data-action="delete-scheduled-task" data-task-id="${escapeHtml(item.task.id)}" data-day="${escapeHtml(item.day)}" data-start="${escapeHtml(item.start)}">✕</button>${taskWarning ? `<span class="item-warning-badge" title="${escapeAttribute(taskWarning.message)}" aria-label="${escapeAttribute(taskWarning.message)}">⚠️</span>` : ""}<div class="item-shift-controls"><button type="button" class="shift-button" data-action="nudge-task" data-task-id="${escapeHtml(item.task.id)}" data-day="${escapeHtml(item.day)}" data-start="${escapeHtml(item.start)}" data-direction="-15">▲</button><button type="button" class="shift-button" data-action="nudge-task" data-task-id="${escapeHtml(item.task.id)}" data-day="${escapeHtml(item.day)}" data-start="${escapeHtml(item.start)}" data-direction="15">▼</button></div><div class="time-label">${prettyTime(item.start)} - ${prettyTime(item.end)} · ${item.durationMin}m</div><p class="item-title">${escapeHtml(item.task.title)}</p><p class="item-meta">${escapeHtml(getProjectName(item.task.projectId) || "Uncategorized")}</p><div class="manual-badge">Chosen${isTaskCompleted(item.task.id) ? " · done" : ""}</div></article>`;
  }
  if (kind === "now") {
    return `<article class="timeline-item now" style="--item-color:${PROJECT_COLORS[0]};"><div class="time-label">${prettyTime(item.time)}</div><p class="item-title">Current time marker</p><p class="item-meta">Scheduling starts from here.</p></article>`;
  }
  const prompt = state.plan?.activePrompt;
  const isActive = item.status === "active" && prompt && prompt.windowId === item.windowId;
  const openTitle = item.status === "future" ? "Later window" : "Open time";
  const openNotes = isActive ? prompt.suggestions.map(({ task }) => `${task.title} (${task.estimateMin}m)`).join(", ") : "";
  return `<article class="timeline-item open" title="${escapeAttribute(buildItemTooltip(openTitle, item.start, item.end, "Available time", openNotes))}" style="--item-color:#b9a48a;--item-bg:rgba(185, 164, 138, 0.16);--item-border:rgba(185, 164, 138, 0.34);"><div class="time-label">${prettyTime(item.start)} - ${prettyTime(item.end)} · ${item.durationMin}m</div><p class="item-title">${openTitle}</p><p class="item-meta">${isActive ? "The focus panel is working on this window now." : "Available but not filled yet."}</p>${isActive ? `<ul class="window-choice-list">${prompt.suggestions.map(({ task }) => `<li>${escapeHtml(task.title)} · ${task.estimateMin}m</li>`).join("")}</ul>` : `<p class="window-empty">${item.status === "future" ? "This opens after the current decision is made." : "Nothing else fits here automatically yet."}</p>`}</article>`;
}

function renderCarryover() {
  if (!els.carryoverSummary || !els.carryoverOutput) return;
  if (!state.plan) {
    els.carryoverSummary.textContent = "Carryover appears after the planner is generated.";
    els.carryoverOutput.value = "";
    return;
  }
  const count = state.plan.carryover.tasks.length;
  els.carryoverSummary.textContent = count ? `${count} task${count === 1 ? "" : "s"} still need next-week consideration.` : "Everything is placed or resolved for this week.";
  els.carryoverOutput.value = JSON.stringify(state.plan.carryover, null, 2);
}

function renderEventsEditor() {
  if (!state.calendarEvents.length) {
    els.eventsEditor.innerHTML = '<div class="empty-card">No fixed events yet. Add them manually or paste extracted event JSON.</div>';
    return;
  }
  els.eventsEditor.innerHTML = state.calendarEvents.slice().sort(compareEvents).map((calendarEvent) => {
    const options = [`<option value="">Uncategorized</option>`].concat(state.projects.map((project) => `<option value="${escapeHtml(project.id)}" ${project.id === calendarEvent.projectId ? "selected" : ""}>${escapeHtml(project.name)}</option>`)).join("");
    return `<article class="event-card" data-event-id="${escapeHtml(calendarEvent.id)}"><div class="event-card-grid"><label class="span-two"><span>Title</span><input data-field="title" value="${escapeAttribute(calendarEvent.title)}" /></label><label><span>Day</span><select data-field="day">${DAYS.map((day) => `<option value="${day}" ${day === calendarEvent.day ? "selected" : ""}>${day}</option>`).join("")}</select></label><label><span>Category</span><select data-field="projectId">${options}</select></label><label><span>Start</span><input data-field="start" type="time" value="${calendarEvent.start}" /></label><label><span>End</span><input data-field="end" type="time" value="${calendarEvent.end}" /></label><label class="span-two"><span>Notes</span><textarea data-field="notes" rows="2">${escapeHtml(calendarEvent.notes || "")}</textarea></label><button type="button" class="ghost small" data-action="delete-event" data-event-id="${escapeHtml(calendarEvent.id)}">Delete Event</button></div></article>`;
  }).join("");
}

function renderTasksEditor() {
  if (!state.tasks.length) {
    els.tasksEditor.innerHTML = '<div class="empty-card">Import a bundle to review tasks, dependencies, and durations.</div>';
    return;
  }
  const groups = state.projects.map((project) => ({ project, tasks: state.tasks.filter((task) => task.projectId === project.id) })).filter((group) => group.tasks.length);
  els.tasksEditor.innerHTML = groups.map(({ project, tasks }) => `
    <section>
      <div class="task-group-head"><div class="project-chip" style="--chip-color:${getProjectColor(project.id)};">${escapeHtml(project.name)}</div><span class="muted">${tasks.length} task${tasks.length === 1 ? "" : "s"}</span></div>
      <div class="stack compact">${tasks.map(renderTaskCard).join("")}</div>
    </section>
  `).join("");
}

function renderTaskCard(task) {
  const options = state.projects.map((project) => `<option value="${escapeHtml(project.id)}" ${project.id === task.projectId ? "selected" : ""}>${escapeHtml(project.name)}</option>`).join("");
  return `<article class="task-card" data-task-id="${escapeHtml(task.id)}"><div class="task-card-grid"><label class="title-field"><span>Task</span><input data-field="title" value="${escapeAttribute(task.title)}" /></label><label><span>Estimate (min)</span><input data-field="estimateMin" type="number" min="0" value="${task.estimateMin ?? ""}" /></label><label><span>Urgency</span><select data-field="urgency">${URGENCY_LABELS.map((label) => `<option value="${label}" ${label === task.urgency ? "selected" : ""}>${label || "unspecified"}</option>`).join("")}</select></label><label><span>Category</span><select data-field="projectId">${options}</select></label><label><span>Cadence</span><select data-field="cadenceType"><option value="once" ${task.cadenceType === "once" ? "selected" : ""}>once</option><option value="multiple" ${task.cadenceType === "multiple" ? "selected" : ""}>multiple</option><option value="routine" ${task.cadenceType === "routine" ? "selected" : ""}>routine</option></select></label><label><span>Every N days</span><input data-field="cadenceDays" type="number" min="1" value="${task.cadenceType === "routine" ? task.cadenceDays ?? 1 : ""}" placeholder="${task.cadenceType === "routine" ? "1" : ""}" ${task.cadenceType === "routine" ? "" : "disabled"} /></label><label><span>Actionable</span><input data-field="actionable" type="checkbox" ${task.actionable ? "checked" : ""} /></label><label><span>Optional</span><input data-field="optional" type="checkbox" ${task.optional ? "checked" : ""} /></label><label class="deps-field"><span>Dependencies (comma-separated task IDs)</span><input data-field="dependsOnIds" value="${escapeAttribute(task.dependsOnIds.join(", "))}" /></label><label class="notes-field"><span>Notes</span><textarea data-field="notes" rows="2">${escapeHtml(task.notes)}</textarea></label></div></article>`;
}

function renderDetailsVisibility() {
  els.detailsPanel.classList.toggle("is-hidden", !state.showDetails);
  document.getElementById("toggle-details").textContent = state.showDetails ? "Hide Review & Edit" : "Open Review & Edit";
}

  function renderImportPanelState() {
    const workspace = document.getElementById("workspace");
    const panel = document.getElementById("import-panel");
    const importEyebrow = document.getElementById("import-eyebrow");
    const topToggle = document.getElementById("toggle-import-panel-top");
    const label = state.importCollapsed ? "Show Import" : "Hide Import";
    workspace.classList.toggle("import-collapsed", state.importCollapsed);
    panel.classList.toggle("is-collapsed", state.importCollapsed);
    if (topToggle) topToggle.textContent = label;
    if (importEyebrow) {
      importEyebrow.textContent = hasParsedPlannerData() ? "Import" : "Start Here";
    }
  }

function renderBoardControls() {
  document.getElementById("view-calendar").classList.toggle("secondary", state.boardView === "calendar");
  document.getElementById("view-calendar").classList.toggle("ghost", state.boardView !== "calendar");
  document.getElementById("view-list").classList.toggle("secondary", state.boardView === "list");
  document.getElementById("view-list").classList.toggle("ghost", state.boardView !== "list");
  const restoreButton = document.getElementById("restore-fixed-events");
  if (restoreButton) {
    restoreButton.classList.toggle("is-hidden", !state.hiddenFixedEventIds.length);
    restoreButton.textContent = state.hiddenFixedEventIds.length ? `Restore Hidden Calendar Items (${state.hiddenFixedEventIds.length})` : "Restore Hidden Calendar Items";
  }
}

  function renderTaskSummaryPlacement() {
    const section = document.getElementById("task-summary").closest(".summary-shell");
    const button = document.getElementById("confirm-task-summary");
    const approvedPill = document.getElementById("task-summary-approved-pill");
    const listButton = document.getElementById("summary-view-list");
    const treeButton = document.getElementById("summary-view-tree");
      const addTaskButton = document.getElementById("add-summary-task-global");
      const renameCategoryButton = document.getElementById("rename-summary-category-global");
      const deleteTaskButton = document.getElementById("delete-summary-task-global");
      const optionalEditButton = document.getElementById("toggle-optional-edit");
    const timeEditButton = document.getElementById("toggle-time-edit");
    const treeEditButton = document.getElementById("toggle-tree-edit");
    const deadlineEditButton = document.getElementById("toggle-deadline-edit");
    if (!section || !button) return;
    section.classList.toggle("summary-at-end", state.taskSummaryAtEnd);
    button.textContent = state.taskSummaryAtEnd ? "Summary Approved" : "This Looks Good";
    button.disabled = state.taskSummaryAtEnd;
    button.hidden = state.taskSummaryAtEnd;
    if (approvedPill) {
      approvedPill.hidden = !state.taskSummaryAtEnd;
    }
    if (listButton && treeButton) {
      listButton.className = `${state.summaryView === "list" ? "secondary" : "ghost"} small`;
      treeButton.className = `${state.summaryView === "tree" ? "secondary" : "ghost"} small`;
    }
    if (addTaskButton) {
      addTaskButton.className = `${state.addTaskMode ? "secondary" : "ghost"} small`;
      addTaskButton.textContent = state.addTaskMode ? "➕ Choose Category" : "➕ Add Task";
    }
      if (renameCategoryButton) {
        renameCategoryButton.className = `${state.renameCategoryMode ? "secondary" : "ghost"} small`;
        renameCategoryButton.textContent = state.renameCategoryMode ? "✏️ Choose Category" : "✏️ Rename Category";
      }
      if (deleteTaskButton) {
        deleteTaskButton.className = `${state.deleteTaskMode ? "secondary" : "ghost"} small`;
        deleteTaskButton.textContent = state.deleteTaskMode ? "❌ Choose Task" : "❌ Delete Task";
      }
      if (optionalEditButton) {
        optionalEditButton.className = `${state.optionalEditMode ? "secondary" : "ghost"} small`;
        optionalEditButton.textContent = state.optionalEditMode ? "🌿 Choose Task" : "🌿 Change Optional";
    }
    if (timeEditButton) {
      timeEditButton.className = `${state.timeEditMode ? "secondary" : "ghost"} small`;
      timeEditButton.textContent = state.timeEditMode ? "Edit Time: Choose Task" : "Edit Time";
      timeEditButton.disabled = state.summaryView !== "list";
      timeEditButton.hidden = state.summaryView !== "list";
    }
      if (treeEditButton) {
        treeEditButton.className = `${state.treeEditMode ? "secondary" : "ghost"} small`;
        treeEditButton.textContent = state.treeEditMode
          ? (state.treeParentTaskId ? "🔗 Choose Earlier Task" : "🔗 Choose Task")
          : "🔗 Link After...";
        treeEditButton.disabled = state.summaryView !== "tree";
        treeEditButton.hidden = state.summaryView !== "tree";
      }
      if (deadlineEditButton) {
        deadlineEditButton.className = `${state.deadlineEditMode ? "secondary" : "ghost"} small`;
        deadlineEditButton.textContent = state.deadlineEditMode ? "⚓ Choose Task" : "⚓ Anchor to...";
      }
  }

function renderImportPriorityState() {
  const panel = document.getElementById("import-panel");
  const guide = document.getElementById("import-guide");
  const parseButton = document.getElementById("import-bundle");
  if (!panel || !guide || !parseButton) return;

  const shouldHighlight = !hasParsedPlannerData();
  panel.classList.toggle("import-priority", shouldHighlight);
  guide.innerHTML = shouldHighlight
    ? "<strong>Start here.</strong> Paste the planner bundle first. Once the bundle parses cleanly, this panel steps back and the board becomes the main surface."
    : "<strong>Bundle loaded.</strong> Reopen import anytime if you want to replace the week or adjust the planning horizon.";
  parseButton.classList.toggle("primary", shouldHighlight);
  parseButton.classList.toggle("secondary", !shouldHighlight);
}

  function renderTaskSummaryGuide() {
    const guide = document.getElementById("task-summary-guide");
    if (!guide) return;
      guide.className = `summary-guide${state.taskSummaryAtEnd ? " is-approved" : ""}`;
        guide.innerHTML = state.timeEditMode && state.summaryView === "list"
          ? "<strong>Time edit mode.</strong> Click a task in the list to update its estimated minutes."
          : state.addTaskMode
          ? "<strong>➕ Add Task.</strong> Click the category chip that should receive the new task."
          : state.renameCategoryMode
          ? "<strong>✏️ Rename Category.</strong> Click the category chip you want to rename."
          : state.deleteTaskMode
          ? "<strong>❌ Delete Task.</strong> Click a task to remove it. Tasks with child tasks cannot be deleted."
          : state.optionalEditMode
          ? "<strong>🌿 Change Optional.</strong> Click a task to toggle its optional status."
          : state.deadlineEditMode
        ? "<strong>⚓ Anchor to...</strong> Click a task, then choose the fixed calendar event it must happen before."
        : state.treeEditMode && state.summaryView === "tree"
        ? `<strong>🔗 Link After...</strong> ${state.treeParentTaskId ? "Now click the earlier task it should come after." : "First click the task you want to move, then click the earlier task it should come after."}`
        : state.taskSummaryAtEnd
        ? "<strong>Summary approved.</strong> You can still scroll back here to edit categories, add tasks, or mark things done."
        : "<strong>Step 1.</strong> First verify that these categories and tasks look right. You can drag tasks across categories, add tasks inside each category, create new categories, and click a task to mark it done or bring it back.";
  }

  function getProjectTaskGraph(tasks) {
    const tasksById = new Map(tasks.map((task) => [task.id, task]));
    const projectTaskIds = new Set(tasks.map((task) => task.id));
    const internalDepsById = new Map(tasks.map((task) => [task.id, task.dependsOnIds.filter((depId) => projectTaskIds.has(depId))]));
    const childrenById = new Map(tasks.map((task) => [task.id, []]));
    internalDepsById.forEach((dependencyIds, taskId) => {
      dependencyIds.forEach((dependencyId) => {
        if (childrenById.has(dependencyId)) childrenById.get(dependencyId).push(taskId);
      });
    });

    const depthMemo = new Map();
    function getDepth(taskId, trail = new Set()) {
      if (depthMemo.has(taskId)) return depthMemo.get(taskId);
      if (trail.has(taskId)) return 0;
      const nextTrail = new Set(trail);
      nextTrail.add(taskId);
      const dependencyIds = internalDepsById.get(taskId) || [];
      const depth = dependencyIds.length
        ? Math.max(...dependencyIds.map((dependencyId) => getDepth(dependencyId, nextTrail) + 1))
        : 0;
      depthMemo.set(taskId, depth);
      return depth;
    }

    function sortTaskIds(taskIds) {
      return [...taskIds].sort((leftId, rightId) => {
        const leftTask = tasksById.get(leftId);
        const rightTask = tasksById.get(rightId);
        return getDepth(leftId) - getDepth(rightId)
          || (leftTask?.estimateMin ?? Number.MAX_SAFE_INTEGER) - (rightTask?.estimateMin ?? Number.MAX_SAFE_INTEGER)
          || String(leftTask?.title || "").localeCompare(String(rightTask?.title || ""));
      });
    }

    const roots = sortTaskIds(tasks.filter((task) => !(internalDepsById.get(task.id) || []).length).map((task) => task.id));
    return { tasksById, internalDepsById, childrenById, roots, sortTaskIds, getDepth };
  }

  function getProjectTaskTreeEntries(tasks) {
    const { tasksById, internalDepsById, childrenById, roots, sortTaskIds, getDepth } = getProjectTaskGraph(tasks);
    const visited = new Set();
    const entries = [];

      function buildTreePrefix(ancestorHasNext, hasParent, isLastChild) {
        if (!hasParent) return "";
        const trunk = ancestorHasNext.map(() => "   ").join("");
        return `${trunk}${isLastChild ? "└─ " : "├─ "}`;
      }

      function visit(taskId, ancestorHasNext = [], isLastChild = true) {
        if (visited.has(taskId)) return;
        visited.add(taskId);
        const task = tasksById.get(taskId);
        if (!task) return;
        const dependencyIds = internalDepsById.get(taskId) || [];
        const parentId = dependencyIds[0] || "";
        const childIds = sortTaskIds(childrenById.get(taskId) || []);
        const hasParent = Boolean(parentId);
        entries.push({
          task,
          depth: getDepth(taskId),
          hasParent,
          parentId,
          parentTitle: parentId && tasksById.get(parentId) ? tasksById.get(parentId).title : "",
          treePrefix: buildTreePrefix(ancestorHasNext, hasParent, isLastChild)
        });
        childIds.forEach((childId, index) => visit(childId, [...ancestorHasNext, !isLastChild], index === childIds.length - 1));
      }

      roots.forEach((rootId, index) => visit(rootId, [], index === roots.length - 1));
      sortTaskIds(tasks.map((task) => task.id)).forEach((taskId) => visit(taskId, [], true));
      return entries;
    }

  function getEffectiveAnchorIndexByTaskId(tasks, anchors) {
    const { childrenById } = getProjectTaskGraph(tasks);
    const directAnchorIndex = new Map();
    anchors.forEach((anchor, index) => {
      (anchor.linkedTaskIds || []).forEach((taskId) => {
        if (!directAnchorIndex.has(taskId)) directAnchorIndex.set(taskId, index);
      });
    });

    const memo = new Map();
    function resolve(taskId) {
      if (memo.has(taskId)) return memo.get(taskId);
      let bestIndex = directAnchorIndex.has(taskId) ? directAnchorIndex.get(taskId) : Number.POSITIVE_INFINITY;
      (childrenById.get(taskId) || []).forEach((childId) => {
        bestIndex = Math.min(bestIndex, resolve(childId));
      });
      memo.set(taskId, bestIndex);
      return bestIndex;
    }

    tasks.forEach((task) => resolve(task.id));
    return memo;
  }

function renderSummaryTaskItem(entry, manuallyPlacedIds, completedIds, taskWarningsById) {
    const action = state.treeEditMode && state.summaryView === "tree"
      ? "tree-select-task"
      : state.timeEditMode && state.summaryView === "list"
      ? "time-edit-task"
      : state.deadlineEditMode
      ? "deadline-select-task"
      : state.optionalEditMode
      ? "optional-select-task"
      : state.deleteTaskMode
      ? "delete-task-select"
      : "toggle-task-complete";
    const ariaLabel = state.treeEditMode && state.summaryView === "tree"
      ? "Choose task for Link After..."
      : state.timeEditMode && state.summaryView === "list"
      ? "Choose task for Edit Time"
      : state.deadlineEditMode
      ? "Choose task for Anchor to..."
      : state.optionalEditMode
      ? "Choose task for Change Optional"
      : state.deleteTaskMode
      ? "Choose task for Delete Task"
      : completedIds.has(entry.task.id)
      ? "Mark task incomplete"
      : "Mark task complete";
    return `<li class="summary-task ${manuallyPlacedIds.has(entry.task.id) ? "is-placed" : ""} ${completedIds.has(entry.task.id) ? "is-complete" : ""} ${taskWarningsById[entry.task.id] ? "has-warning" : ""} ${state.summaryView === "tree" ? "is-tree" : "is-list"} ${state.treeEditMode && state.summaryView === "tree" ? "is-tree-editing" : ""} ${state.treeParentTaskId === entry.task.id ? "is-tree-parent" : ""} ${state.timeEditMode && state.summaryView === "list" ? "is-time-editing" : ""} ${state.deadlineEditMode ? "is-deadline-editing" : ""} ${state.optionalEditMode ? "is-optional-editing" : ""} ${state.deleteTaskMode ? "is-delete-editing" : ""}" draggable="true" data-task-id="${escapeHtml(entry.task.id)}" data-drag-source="summary" data-depth="${state.summaryView === "tree" ? entry.depth : 0}" title="${escapeAttribute(taskWarningsById[entry.task.id]?.message || entry.task.title)}">${state.summaryView === "tree" && entry.treePrefix ? `<span class="summary-task-branch ${entry.hasParent ? "is-dependent" : "is-root"}" aria-hidden="true">${escapeHtml(entry.treePrefix)}</span>` : ""}<button type="button" class="summary-task-toggle" data-action="${action}" data-task-id="${escapeHtml(entry.task.id)}" aria-label="${ariaLabel}"><span class="summary-task-main"><span class="summary-task-label">${escapeHtml(entry.task.title)}</span></span></button>${state.summaryView === "list" && entry.task.estimateMin ? `<span class="estimate-pill">${entry.task.estimateMin}m</span>` : ""}${entry.task.optional ? `<span class="summary-optional-icon" title="Optional task" aria-label="Optional task">(🌿)</span>` : ""}${taskWarningsById[entry.task.id] ? `<span class="summary-warning-icon" title="${escapeAttribute(taskWarningsById[entry.task.id].message)}" aria-label="${escapeAttribute(taskWarningsById[entry.task.id].message)}">⚠️</span>` : ""}<span class="summary-status-icon" aria-hidden="true">${completedIds.has(entry.task.id) ? "✅" : manuallyPlacedIds.has(entry.task.id) ? "📌" : "💭"}</span></li>`;
  }

function renderSummaryAnchor(anchor, project, options = {}) {
    const isComplete = options.isComplete === true && !anchor.hasWarnings;
    const celebration = isComplete ? getCelebrationMessage(anchor.id) : "";
    const classes = [
      "summary-anchor",
      anchor.hasWarnings ? "has-warning" : "",
      isComplete ? "has-success" : ""
    ].filter(Boolean).join(" ");
    const title = isComplete
      ? `${celebration}. Everything linked to ${anchor.title} is done.`
      : (anchor.message || `Must be done before ${anchor.title}.`);
    const lead = isComplete
      ? celebration
      : (anchor.hasWarnings ? "⚠️ Must be done before" : "Must be done before");
    const arrow = isComplete ? "🎉" : "↑";
    return `<div class="${classes}" style="--anchor-color:${getProjectColor(anchor.projectId || project.id)};" title="${escapeAttribute(title)}"><div class="summary-anchor-copy"><span class="summary-anchor-arrow" aria-hidden="true">${arrow}</span><span class="summary-anchor-lead">${lead}</span><strong class="summary-anchor-bubble">${escapeHtml(anchor.title)}</strong></div><span class="summary-anchor-meta">${anchor.kind === "deadline" ? "Deadline" : "Calendar block"} · ${escapeHtml(formatDayTimeLabel(anchor.day, anchor.start))}</span></div>`;
  }

function getCelebrationMessage(anchorId) {
  if (!anchorId) return CELEBRATION_MESSAGES[0];
  if (state.anchorCelebrationById?.[anchorId]) return state.anchorCelebrationById[anchorId];

  const recent = Array.isArray(state.recentCelebrations) ? state.recentCelebrations : [];
  let candidates = CELEBRATION_MESSAGES.filter((message) => !recent.includes(message));
  if (!candidates.length) candidates = [...CELEBRATION_MESSAGES];
  const choice = candidates[Math.floor(Math.random() * candidates.length)] || CELEBRATION_MESSAGES[0];

  state.anchorCelebrationById = {
    ...(state.anchorCelebrationById || {}),
    [anchorId]: choice
  };
  state.recentCelebrations = [...recent.filter((message) => message !== choice), choice].slice(-3);
  return choice;
}

  function renderProjectTaskSections(tasks, project, anchors, manuallyPlacedIds, completedIds, taskWarningsById) {
    const entries = getProjectTaskTreeEntries(tasks);
    const effectiveAnchorIndexByTaskId = getEffectiveAnchorIndexByTaskId(tasks, anchors);
    const isExpanded = state.expandedProjectIds.includes(project.id);
    const taskLimit = isExpanded ? Number.POSITIVE_INFINITY : 4;
    let renderedTaskCount = 0;
    let html = "";

    anchors.forEach((anchor, index) => {
      if (renderedTaskCount >= taskLimit) return;
      const sectionEntries = entries.filter((entry) => effectiveAnchorIndexByTaskId.get(entry.task.id) === index);
      if (!sectionEntries.length) return;
      const visibleEntries = sectionEntries.slice(0, Math.max(0, taskLimit - renderedTaskCount));
      if (!visibleEntries.length) return;
      const isComplete = sectionEntries.every((entry) => completedIds.has(entry.task.id));
      html += `<ul>${visibleEntries.map((entry) => renderSummaryTaskItem(entry, manuallyPlacedIds, completedIds, taskWarningsById)).join("")}</ul>`;
      html += `<div class="summary-anchor-list">${renderSummaryAnchor(anchor, project, { isComplete })}</div>`;
      renderedTaskCount += visibleEntries.length;
    });

    if (renderedTaskCount < taskLimit) {
      const unanchoredEntries = entries.filter((entry) => !Number.isFinite(effectiveAnchorIndexByTaskId.get(entry.task.id)));
      const visibleEntries = unanchoredEntries.slice(0, Math.max(0, taskLimit - renderedTaskCount));
      if (visibleEntries.length) {
        html += `<ul>${visibleEntries.map((entry) => renderSummaryTaskItem(entry, manuallyPlacedIds, completedIds, taskWarningsById)).join("")}</ul>`;
      }
    }

    return html;
  }

  function getVisibleProjectTasks(tasks, projectId) {
      const entries = getProjectTaskTreeEntries(tasks);
      return state.expandedProjectIds.includes(projectId) ? entries : entries.slice(0, 4);
    }

  function setSummaryView(view) {
    if (!["list", "tree"].includes(view) || state.summaryView === view) return;
    state.summaryView = view;
    if (view !== "tree") {
      state.treeEditMode = false;
      state.treeParentTaskId = "";
    }
    if (view !== "list") {
      state.timeEditMode = false;
    }
    state.addTaskMode = false;
    state.deadlineEditMode = false;
    state.renameCategoryMode = false;
    renderTaskSummary();
    renderTaskSummaryPlacement();
    renderTaskSummaryGuide();
    saveSession();
  }

function toggleProjectExpansion(projectId) {
  if (!projectId) return;
  const expanded = new Set(state.expandedProjectIds);
  if (expanded.has(projectId)) expanded.delete(projectId);
  else expanded.add(projectId);
  state.expandedProjectIds = [...expanded];
  renderTaskSummary();
  saveSession();
}

function chooseProjectFromPrompt(promptLabel = "Choose a category by number:") {
  const availableProjects = state.projects.filter((project) =>
    state.tasks.some((task) => task.projectId === project.id) || state.userCreatedProjectIds.includes(project.id)
  );
  if (!availableProjects.length) {
    setStatus("There are no categories available yet.", "error");
    return null;
  }
  const options = availableProjects.map((project, index) => `${index + 1}. ${project.name}`).join("\n");
  const response = window.prompt(`${promptLabel}\n\n${options}`, "1");
  if (response === null) return null;
  const choice = Number.parseInt(String(response).trim(), 10);
  if (!Number.isFinite(choice) || choice < 1 || choice > availableProjects.length) {
    setStatus("Please choose a valid category number.", "error");
    return null;
  }
  return availableProjects[choice - 1];
}

function toggleAddTaskMode() {
    state.renameCategoryMode = false;
    state.deleteTaskMode = false;
    state.treeEditMode = false;
  state.treeParentTaskId = "";
  state.timeEditMode = false;
  state.deadlineEditMode = false;
  state.optionalEditMode = false;
  state.addTaskMode = !state.addTaskMode;
  setStatus(
    state.addTaskMode
      ? "➕ Add Task is on. Click the category chip that should receive the new task."
      : "➕ Add Task is off.",
    "ok"
  );
  renderTaskSummary();
  renderTaskSummaryPlacement();
  renderTaskSummaryGuide();
  saveSession();
}

function toggleRenameCategoryMode() {
    state.addTaskMode = false;
    state.deleteTaskMode = false;
    state.treeEditMode = false;
  state.treeParentTaskId = "";
  state.timeEditMode = false;
  state.deadlineEditMode = false;
  state.optionalEditMode = false;
  state.renameCategoryMode = !state.renameCategoryMode;
  setStatus(
    state.renameCategoryMode
      ? "✏️ Rename Category is on. Click a category chip to rename it."
      : "✏️ Rename Category is off.",
    "ok"
  );
  renderTaskSummary();
  renderTaskSummaryPlacement();
  renderTaskSummaryGuide();
  saveSession();
}

  function addTaskFromSummary(projectId) {
    const title = window.prompt("Task title:");
    if (!title) return;
    const estimateRaw = window.prompt("Estimate in minutes (optional):", "30");
    const urgencyRaw = window.prompt("Urgency? (high, medium, low, or leave blank)", "medium");
    const task = {
      id: uid("task"),
      title: String(title).trim(),
      projectId: projectId || "",
      estimateMin: normalizeEstimate(estimateRaw),
    urgency: normalizeUrgency(urgencyRaw),
    actionable: true,
    dependsOnIds: [],
      notes: "",
      optional: false,
      cadenceType: "once",
      cadenceDays: null
    };
    state.tasks.push(task);
    state.addTaskMode = false;
    setStatus(`Added "${String(title).trim()}" to ${getProjectName(projectId) || "the planner"}.`, "ok");
    buildAndRenderPlan();
  }

function toggleDeleteTaskMode() {
    state.addTaskMode = false;
    state.renameCategoryMode = false;
    state.treeEditMode = false;
    state.treeParentTaskId = "";
    state.timeEditMode = false;
    state.deadlineEditMode = false;
    state.optionalEditMode = false;
    state.deleteTaskMode = !state.deleteTaskMode;
    setStatus(
      state.deleteTaskMode
        ? "❌ Delete Task is on. Click one task to remove it from this session."
        : "❌ Delete Task is off.",
      "ok"
    );
    renderTaskSummary();
    renderTaskSummaryPlacement();
    renderTaskSummaryGuide();
    saveSession();
  }

    function toggleTreeEditMode() {
        if (state.summaryView !== "tree") {
          setStatus("Switch Task Summary to Tree view to use 🔗 Link After...", "error");
          return;
        }
        state.addTaskMode = false;
        state.renameCategoryMode = false;
        state.deleteTaskMode = false;
        state.timeEditMode = false;
        state.deadlineEditMode = false;
        state.optionalEditMode = false;
      state.treeEditMode = !state.treeEditMode;
    state.treeParentTaskId = "";
    renderTaskSummary();
    renderTaskSummaryPlacement();
    renderTaskSummaryGuide();
    saveSession();
  }

  function toggleTimeEditMode() {
      if (state.summaryView !== "list") {
        setStatus("Switch Task Summary to List view to edit task time.", "error");
        return;
      }
      state.addTaskMode = false;
      state.renameCategoryMode = false;
      state.deleteTaskMode = false;
      state.treeEditMode = false;
    state.treeParentTaskId = "";
    state.deadlineEditMode = false;
    state.optionalEditMode = false;
    state.timeEditMode = !state.timeEditMode;
    renderTaskSummary();
    renderTaskSummaryPlacement();
    renderTaskSummaryGuide();
    saveSession();
  }

  function toggleOptionalEditMode() {
      state.addTaskMode = false;
      state.renameCategoryMode = false;
      state.deleteTaskMode = false;
      state.treeEditMode = false;
    state.treeParentTaskId = "";
    state.timeEditMode = false;
    state.deadlineEditMode = false;
    state.optionalEditMode = !state.optionalEditMode;
    setStatus(
      state.optionalEditMode
        ? "🌿 Change Optional is on. Click one task to toggle whether it is optional."
        : "🌿 Change Optional is off.",
      "ok"
    );
    renderTaskSummary();
    renderTaskSummaryPlacement();
    renderTaskSummaryGuide();
    saveSession();
  }

  function toggleDeadlineEditMode() {
        state.addTaskMode = false;
        state.renameCategoryMode = false;
        state.deleteTaskMode = false;
        state.treeEditMode = false;
      state.treeParentTaskId = "";
      state.timeEditMode = false;
      state.optionalEditMode = false;
      state.deadlineEditMode = !state.deadlineEditMode;
      renderTaskSummary();
      renderTaskSummaryPlacement();
      renderTaskSummaryGuide();
      saveSession();
  }

  function handleTreeSelection(taskId) {
      if (!state.treeEditMode || state.summaryView !== "tree" || !taskId) return;
      const task = state.tasks.find((candidate) => candidate.id === taskId);
      if (!task) return;
      if (!state.treeParentTaskId) {
        state.treeParentTaskId = taskId;
        setStatus(`Selected "${task.title}". Now click the earlier task it should come after.`, "ok");
        renderTaskSummary();
        renderTaskSummaryPlacement();
        renderTaskSummaryGuide();
        saveSession();
        return;
      }
      if (state.treeParentTaskId === taskId) {
        state.treeParentTaskId = "";
        setStatus("Task selection cleared.", "ok");
        renderTaskSummary();
        renderTaskSummaryPlacement();
        renderTaskSummaryGuide();
        saveSession();
        return;
      }
      assignTaskParent(state.treeParentTaskId, taskId);
    }

  function handleTimeEditSelection(taskId) {
    if (!state.timeEditMode || state.summaryView !== "list" || !taskId) return;
    const task = state.tasks.find((candidate) => candidate.id === taskId);
    if (!task) return;
    const response = window.prompt(`Update minutes for "${task.title}"`, task.estimateMin ?? "");
    if (response === null) return;
    task.estimateMin = normalizeEstimate(response);
    state.timeEditMode = false;
    setStatus(task.estimateMin ? `Updated "${task.title}" to ${task.estimateMin} minutes.` : `Cleared the estimate for "${task.title}".`, "ok");
    buildAndRenderPlan();
  }

  function handleDeadlineSelection(taskId) {
    if (!state.deadlineEditMode || !taskId) return;
    const task = state.tasks.find((candidate) => candidate.id === taskId);
    if (!task) return;
    if (task.optional) {
      const message = `"${task.title}" is optional, so it cannot be anchored to a deadline.`;
      setStatus(message, "error");
      if (state.importCollapsed) window.alert(message);
      return;
    }
    const fixedEvents = [...(state.plan?.fixedEvents || [])].sort((left, right) => compareDayTime(left.day, left.start, right.day, right.start));
    if (!fixedEvents.length) {
      const message = "There are no fixed calendar events available to use as deadlines yet.";
      setStatus(message, "error");
      if (state.importCollapsed) window.alert(message);
      return;
    }
    const options = fixedEvents.map((event, index) => `${index + 1}. ${event.title} (${event.day} ${prettyTime(event.start)})`).join("\n");
    const currentAnchorId = state.taskAnchorOverrides?.[taskId] || "";
    const currentEvent = currentAnchorId ? fixedEvents.find((event) => event.id === currentAnchorId) : null;
    const response = window.prompt(
      `Choose a calendar deadline for "${task.title}".\n\n${options}\n\nEnter a number, or type 0 to clear the deadline link.${currentEvent ? `\nCurrent: ${currentEvent.title} (${currentEvent.day} ${prettyTime(currentEvent.start)})` : ""}`,
      currentEvent ? String(fixedEvents.findIndex((event) => event.id === currentEvent.id) + 1) : ""
    );
    if (response === null) return;
    const choice = Number.parseInt(String(response).trim(), 10);
    if (!Number.isFinite(choice)) {
      const message = "Please enter a number from the deadline list.";
      setStatus(message, "error");
      if (state.importCollapsed) window.alert(message);
      return;
    }
    if (choice === 0) {
      delete state.taskAnchorOverrides[taskId];
      state.deadlineEditMode = false;
      setStatus(`Cleared the deadline link for "${task.title}".`, "ok");
      buildAndRenderPlan();
      return;
    }
    const selectedEvent = fixedEvents[choice - 1];
    if (!selectedEvent) {
      const message = "That deadline choice is out of range.";
      setStatus(message, "error");
      if (state.importCollapsed) window.alert(message);
      return;
    }
    state.taskAnchorOverrides[taskId] = selectedEvent.id;
    state.deadlineEditMode = false;
    setStatus(`Linked "${task.title}" to "${selectedEvent.title}".`, "ok");
    buildAndRenderPlan();
  }

  function getInternalParentTasks(task) {
    const taskIdsInProject = new Set(
      state.tasks
        .filter((candidate) => candidate.projectId === task.projectId)
        .map((candidate) => candidate.id)
    );
    return task.dependsOnIds
      .filter((dependencyId) => taskIdsInProject.has(dependencyId))
      .map((dependencyId) => state.tasks.find((candidate) => candidate.id === dependencyId))
      .filter(Boolean);
  }

  function hasOptionalAncestor(taskId, trail = new Set()) {
    if (trail.has(taskId)) return false;
    trail.add(taskId);
    const task = state.tasks.find((candidate) => candidate.id === taskId);
    if (!task) return false;
    return getInternalParentTasks(task).some((parent) => parent.optional || hasOptionalAncestor(parent.id, trail));
  }

  function getOptionalAncestorTask(taskId, trail = new Set()) {
    if (trail.has(taskId)) return null;
    trail.add(taskId);
    const task = state.tasks.find((candidate) => candidate.id === taskId);
    if (!task) return null;
    for (const parent of getInternalParentTasks(task)) {
      if (parent.optional) return parent;
      const ancestor = getOptionalAncestorTask(parent.id, trail);
      if (ancestor) return ancestor;
    }
    return null;
  }

  function getTaskAnchorAssociation(taskId) {
    if (!taskId) return null;
    const explicitAnchorId = state.taskAnchorOverrides?.[taskId];
    if (explicitAnchorId) {
      const explicitEvent = (state.plan?.fixedEvents || []).find((event) => event.id === explicitAnchorId)
        || state.calendarEvents.find((event) => event.id === explicitAnchorId);
      return explicitEvent ? { ...explicitEvent, source: "explicit" } : { id: explicitAnchorId, source: "explicit" };
    }
    const task = state.tasks.find((candidate) => candidate.id === taskId);
    if (!task) return null;
    const anchors = state.plan?.projectAnchors?.[task.projectId] || [];
    if (!anchors.length) return null;
    const projectTasks = state.tasks.filter((candidate) => candidate.projectId === task.projectId);
    const effectiveAnchorIndexByTaskId = getEffectiveAnchorIndexByTaskId(projectTasks, anchors);
    const anchorIndex = effectiveAnchorIndexByTaskId.get(taskId);
    if (!Number.isFinite(anchorIndex)) return null;
    const anchor = anchors[anchorIndex];
    return anchor ? { ...anchor, source: "inferred" } : null;
  }

  function isTaskLinkedToDeadline(taskId) {
    return Boolean(getTaskAnchorAssociation(taskId));
  }

  function getOptionalToggleError(task, nextOptional) {
    if (nextOptional) {
      if (isTaskLinkedToDeadline(task.id)) {
        return `"${task.title}" is linked to a deadline, so it cannot be optional.`;
      }
      const blockingDescendant = getDescendantTaskIds(task.id)
        .map((descendantId) => state.tasks.find((candidate) => candidate.id === descendantId))
        .find((descendant) => descendant && !descendant.optional);
      if (blockingDescendant) {
        return `"${task.title}" cannot become optional while "${blockingDescendant.title}" still depends on it as a required task.`;
      }
      return "";
    }
    const optionalAncestor = getOptionalAncestorTask(task.id);
    if (optionalAncestor) {
      return `"${task.title}" cannot become required while it still comes after optional task "${optionalAncestor.title}".`;
    }
    return "";
  }

  function getDescendantTaskIds(taskId) {
    const childrenById = new Map(state.tasks.map((task) => [task.id, []]));
    state.tasks.forEach((task) => {
      task.dependsOnIds.forEach((dependencyId) => {
        if (childrenById.has(dependencyId)) childrenById.get(dependencyId).push(task.id);
      });
    });
    const descendants = [];
    const visited = new Set();
    const stack = [...(childrenById.get(taskId) || [])];
    while (stack.length) {
      const currentId = stack.pop();
      if (!currentId || visited.has(currentId)) continue;
      visited.add(currentId);
      descendants.push(currentId);
      stack.push(...(childrenById.get(currentId) || []));
    }
    return descendants;
  }

  function handleOptionalSelection(taskId) {
    if (!state.optionalEditMode || !taskId) return;
    const task = state.tasks.find((candidate) => candidate.id === taskId);
    if (!task) return;

    const nextOptional = !task.optional;
    const toggleError = getOptionalToggleError(task, nextOptional);
    if (toggleError) {
      setStatus(toggleError, "error");
      if (state.importCollapsed) window.alert(toggleError);
      return;
    }

    task.optional = nextOptional;
    state.optionalEditMode = false;
    setStatus(
      nextOptional
        ? `Marked "${task.title}" as optional.`
        : `Marked "${task.title}" as required.`,
      "ok"
    );
    buildAndRenderPlan();
  }

  function handleDeleteTaskSelection(taskId) {
    if (!state.deleteTaskMode || !taskId) return;
    const task = state.tasks.find((candidate) => candidate.id === taskId);
    if (!task) return;

    const childTasks = state.tasks.filter((candidate) => candidate.dependsOnIds.includes(taskId));
    if (childTasks.length) {
      const message = `"${task.title}" cannot be deleted while "${childTasks[0].title}" still comes after it.`;
      setStatus(message, "error");
      if (state.importCollapsed) window.alert(message);
      return;
    }

    state.tasks = state.tasks.filter((candidate) => candidate.id !== taskId);
    state.tasks.forEach((candidate) => {
      candidate.dependsOnIds = candidate.dependsOnIds.filter((dependencyId) => dependencyId !== taskId);
    });
    state.completedTaskIds = state.completedTaskIds.filter((completedId) => completedId !== taskId);
    state.manualPlacements = state.manualPlacements.filter((placement) => placement.taskId !== taskId);
    state.choices = Object.fromEntries(Object.entries(state.choices).filter(([, chosenTaskId]) => chosenTaskId !== taskId));
    if (state.taskAnchorOverrides?.[taskId]) delete state.taskAnchorOverrides[taskId];
    if (state.treeParentTaskId === taskId) state.treeParentTaskId = "";
    if (state.dragTaskId === taskId) {
      state.dragTaskId = "";
      state.dragSource = "";
    }

    state.deleteTaskMode = false;
    setStatus(`Deleted "${task.title}". Re-import the bundle if you want it back.`, "ok");
    buildAndRenderPlan();
  }

  function assignTaskParent(childId, parentId) {
    const child = state.tasks.find((candidate) => candidate.id === childId);
    const parent = state.tasks.find((candidate) => candidate.id === parentId);
    if (!child || !parent) return;
    if (child.projectId !== parent.projectId) {
      setStatus("Parent and child need to be in the same category.", "error");
      return;
    }
    if (wouldCreateDependencyCycle(child.id, parent.id)) {
      setStatus("That parent would create a circular dependency.", "error");
      return;
    }
    if (parent.optional && !child.optional) {
      setStatus(`"${child.title}" must be optional before it can sit under optional parent "${parent.title}".`, "error");
      return;
    }
    const projectTaskIds = new Set(state.tasks.filter((task) => task.projectId === child.projectId).map((task) => task.id));
    const externalDeps = child.dependsOnIds.filter((depId) => !projectTaskIds.has(depId));
    child.dependsOnIds = [parent.id, ...externalDeps];
    state.treeParentTaskId = "";
    state.treeEditMode = false;
    setStatus(`Linked "${child.title}" after "${parent.title}".`, "ok");
    buildAndRenderPlan();
  }

  function wouldCreateDependencyCycle(childId, parentId) {
    if (childId === parentId) return true;
    const childrenById = new Map(state.tasks.map((task) => [task.id, []]));
    state.tasks.forEach((task) => {
      task.dependsOnIds.forEach((dependencyId) => {
        if (childrenById.has(dependencyId)) childrenById.get(dependencyId).push(task.id);
      });
    });
    const stack = [...(childrenById.get(childId) || [])];
    const visited = new Set();
    while (stack.length) {
      const currentId = stack.pop();
      if (!currentId || visited.has(currentId)) continue;
      if (currentId === parentId) return true;
      visited.add(currentId);
      stack.push(...(childrenById.get(currentId) || []));
    }
    return false;
  }

  function renameProject(projectId) {
    const project = state.projects.find((candidate) => candidate.id === projectId);
    if (!project) return;
    const nextName = window.prompt("Category name:", project.name);
    if (!nextName) return;
  project.name = String(nextName).trim() || project.name;
  state.renameCategoryMode = false;
  setStatus(`Renamed category to "${project.name}".`, "ok");
    renderAll();
    saveSession();
  }

  function deleteEmptyProject(projectId) {
    if (!projectId) return;
    const project = state.projects.find((candidate) => candidate.id === projectId);
    if (!project) return;
    const hasTasks = state.tasks.some((task) => task.projectId === projectId);
    if (hasTasks) {
      setStatus(`"${project.name}" still has tasks, so it cannot be deleted.`, "error");
      return;
    }
    if (!window.confirm(`Delete the empty category "${project.name}"?`)) return;
    state.projects = state.projects.filter((candidate) => candidate.id !== projectId);
    state.userCreatedProjectIds = state.userCreatedProjectIds.filter((id) => id !== projectId);
    state.expandedProjectIds = state.expandedProjectIds.filter((id) => id !== projectId);
    state.treeEditMode = false;
    state.treeParentTaskId = "";
    setStatus(`Deleted empty category "${project.name}".`, "ok");
    renderAll();
    saveSession();
  }

  function syncInputValues() {
    if (document.activeElement !== els.bundleInput) els.bundleInput.value = state.bundleInput;
    if (document.activeElement !== els.extractionInput) els.extractionInput.value = state.extractionInput;
    els.dayStart.value = String(state.settings.dayStart);
    els.dayEnd.value = String(state.settings.dayEnd);
    els.useSystemTime.checked = Boolean(state.settings.useSystemTime);
    els.currentTime.disabled = Boolean(state.settings.useSystemTime);
    if (document.activeElement !== els.currentTime || state.settings.useSystemTime) {
      els.currentTime.value = normalizeDateTimeLocal(state.weeklyContext.currentTime);
    }
  }

function onFocusClick(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  if (button.dataset.action === "restart-pass") {
    restartSchedulingPass();
    return;
  }
  if (!button.dataset.promptId) return;
  if (button.dataset.action === "choose-task") {
    const prompt = state.plan?.activePrompt;
    const task = state.tasks.find((candidate) => candidate.id === button.dataset.taskId);
    if (!prompt || prompt.promptId !== button.dataset.promptId || !task) {
      setStatus("That suggestion is no longer in sync with the current board.", "error");
      buildAndRenderPlan();
      return;
    }
    const originalPlacement = !taskAllowsMultiplePlacements(task)
      ? state.manualPlacements.find((placement) => placement.taskId === task.id) || null
      : null;
    if (!upsertManualPlacement(task, prompt.day, prompt.start, originalPlacement)) {
      setStatus(`"${task.title}" could not be placed into that window.`, "error");
      buildAndRenderPlan();
      return;
    }
    setStatus(`Placed "${task.title}" on ${prompt.day} at ${prettyTime(prompt.start)}.`, "ok");
    buildAndRenderPlan();
    return;
  }
  if (button.dataset.action === "skip-window") {
    state.choices[button.dataset.promptId] = SKIP_VALUE;
    buildAndRenderPlan();
  }
}

function onTaskDragStart(event) {
  const source = event.target.closest("[data-task-id]");
  if (!source) return;
  const taskId = source.dataset.taskId;
  if (!taskId) return;
  state.dragTaskId = taskId;
  state.dragSource = source.dataset.dragSource || "";
  source.classList.add("is-dragging");
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", taskId);
  }
}

function onTaskDragEnd(event) {
  state.dragTaskId = "";
  state.dragSource = "";
  event.target.closest("[data-task-id]")?.classList.remove("is-dragging");
  clearDropTargets();
  clearSummaryDropTargets();
}

function onBoardDragOver(event) {
  const dropDay = event.target.closest(".calendar-day-body[data-drop-day]");
  if (!dropDay || !state.dragTaskId || state.dragSource !== "focus") return;
  event.preventDefault();
  maybeAutoScrollDuringDrag(event);
  clearDropTargets();
  dropDay.classList.add("is-drop-target");
}

function onBoardDrop(event) {
  const dropDay = event.target.closest(".calendar-day-body[data-drop-day]");
  clearDropTargets();
  const taskId = state.dragTaskId || event.dataTransfer?.getData("text/plain");
  state.dragTaskId = "";
  const dragSource = state.dragSource;
  state.dragSource = "";
  if (!dropDay || !taskId || dragSource !== "focus") return;
  event.preventDefault();

  const task = state.tasks.find((candidate) => candidate.id === taskId);
  if (!task || !Number.isFinite(task.estimateMin) || task.estimateMin <= 0) {
    setStatus("That task needs an estimate before it can be dragged onto the board.", "error");
    return;
  }

  const originalPlacement = !taskAllowsMultiplePlacements(task) ? state.manualPlacements.find((placement) => placement.taskId === task.id) || null : null;
  const start = getDropStartTime(event, dropDay, task, originalPlacement);
  if (!start) {
    setStatus(`"${task.title}" does not fit at that spot.`, "error");
    return;
  }

  if (!upsertManualPlacement(task, dropDay.dataset.dropDay, start, originalPlacement)) {
    setStatus(`"${task.title}" could not be placed there.`, "error");
    return;
  }

  setStatus(`Placed "${task.title}" on ${dropDay.dataset.dropDay} at ${prettyTime(start)}.`, "ok");
  buildAndRenderPlan();
}

function onTaskSummaryDragOver(event) {
  const card = event.target.closest(".summary-card[data-project-id]");
  if (!card || !state.dragTaskId || state.dragSource !== "summary") return;
  event.preventDefault();
  maybeAutoScrollDuringDrag(event);
  clearSummaryDropTargets();
  card.classList.add("is-drop-target");
}

function onTaskSummaryDrop(event) {
  const card = event.target.closest(".summary-card[data-project-id]");
  clearSummaryDropTargets();
  const taskId = state.dragTaskId || event.dataTransfer?.getData("text/plain");
  const dragSource = state.dragSource;
  state.dragTaskId = "";
  state.dragSource = "";
  if (!card || !taskId || dragSource !== "summary") return;
  event.preventDefault();
  const task = state.tasks.find((candidate) => candidate.id === taskId);
  if (!task) return;
  task.projectId = card.dataset.projectId;
  setStatus(`Moved "${task.title}" to ${getProjectName(task.projectId) || "that category"}.`, "ok");
  buildAndRenderPlan();
}

function onBoardClick(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  if (button.dataset.action === "hide-fixed-event") {
    const hidden = hideFixedEvent(button.dataset.eventId);
    if (!hidden) {
      setStatus("That fixed calendar item could not be hidden.", "error");
      return;
    }
    setStatus(`Hidden "${hidden.title}" from the calendar.`, "ok");
    buildAndRenderPlan();
    return;
  }
  if (button.dataset.action === "delete-scheduled-task") {
    const removed = removeScheduledTask(button.dataset.taskId, button.dataset.day, button.dataset.start);
    if (!removed) {
      setStatus("That scheduled task could not be removed cleanly.", "error");
      return;
    }
    setStatus(`Removed "${removed.title}" from the calendar.`, "ok");
    buildAndRenderPlan();
    return;
  }
  if (button.dataset.action !== "nudge-task") return;

  const task = state.tasks.find((candidate) => candidate.id === button.dataset.taskId);
  if (!task) return;

  const direction = Number(button.dataset.direction || 0);
  const day = button.dataset.day;
  const start = button.dataset.start;
  if (!direction || !day || !start) return;

  const shifted = nudgeScheduledTask(task, day, start, direction);
  if (!shifted) {
    setStatus(`"${task.title}" cannot move ${direction > 0 ? "later" : "earlier"} by 15 minutes there.`, "error");
    return;
  }

  setStatus(`Moved "${task.title}" to ${prettyTime(shifted)} on ${day}.`, "ok");
  buildAndRenderPlan();
}

function hideFixedEvent(eventId) {
  if (!eventId) return null;
  const fixedEvent = state.calendarEvents.find((event) => event.id === eventId);
  if (!fixedEvent) return null;
  const confirmed = window.confirm(`Are you sure you want to hide "${fixedEvent.title}" from the imported calendar?`);
  if (!confirmed) return null;
  persistExplicitAssignments();
  state.hiddenFixedEventIds = [...new Set([...state.hiddenFixedEventIds, eventId])];
  return fixedEvent;
}

function persistExplicitAssignments() {
  const assignedSegments = state.plan?.assignedSegments || [];
  if (!assignedSegments.length) return;

  assignedSegments
    .filter((segment) => segment.mode === "manual")
    .forEach((segment) => {
      if (!findManualPlacement(segment.task.id, segment.day, segment.start)) {
        state.manualPlacements.push({ taskId: segment.task.id, day: segment.day, start: segment.start });
      }
      if (segment.promptId) delete state.choices[segment.promptId];
    });
}

function toggleTaskComplete(taskId) {
  if (!taskId) return;
  const task = state.tasks.find((candidate) => candidate.id === taskId);
  if (!task) return;

  state.choices = Object.fromEntries(Object.entries(state.choices).filter(([, chosenTaskId]) => chosenTaskId !== taskId));
  const completed = new Set(state.completedTaskIds);
  const shouldComplete = !completed.has(taskId);
  if (shouldComplete) {
    completed.add(taskId);
    persistScheduledOccurrences(taskId);
    setStatus(`Marked "${task.title}" as done.`, "ok");
  } else {
    completed.delete(taskId);
    setStatus(`Marked "${task.title}" as not done.`, "ok");
  }
  state.completedTaskIds = [...completed];
  buildAndRenderPlan();
}

function persistScheduledOccurrences(taskId) {
  const scheduledSegments = (state.plan?.assignedSegments || []).filter((segment) => segment.task.id === taskId);
  scheduledSegments.forEach((segment) => {
    if (findManualPlacement(taskId, segment.day, segment.start)) return;
    state.manualPlacements.push({ taskId, day: segment.day, start: segment.start });
  });
}

function nudgeScheduledTask(task, day, start, deltaMinutes) {
  const scheduled = findScheduledSegment(task.id, day, start);
  if (!scheduled) return "";
  const nextStartMin = toMinutes(start) + deltaMinutes;
  if (nextStartMin < 0) return "";
  const nextStart = fromMinutes(nextStartMin);
  const originalPlacement = findManualPlacement(task.id, day, start) || { taskId: task.id, day, start, key: scheduled.key };
  const occupied = getPlacementOccupiedSegments();
  const excludedKey = scheduled.key;
  if (!canPlaceTaskAt(task, day, nextStart, occupied, excludedKey)) return "";
  if (scheduled.mode !== "manual" && scheduled.promptId) {
    state.choices[scheduled.promptId] = SKIP_VALUE;
  }
  if (!upsertManualPlacement(task, day, nextStart, originalPlacement)) return "";
  return nextStart;
}

function removeScheduledTask(taskId, day, start) {
  const scheduled = findScheduledSegment(taskId, day, start);
  if (!scheduled) return null;
  state.manualPlacements = state.manualPlacements.filter((placement) => !(placement.taskId === taskId && placement.day === day && placement.start === start));
  if (scheduled.promptId) state.choices[scheduled.promptId] = SKIP_VALUE;
  return scheduled.task;
}

function getDropStartTime(event, dropDay, task, originalPlacement = null) {
  const day = dropDay.dataset.dropDay;
  const rect = dropDay.getBoundingClientRect();
  const pixelsPerMinute = 1.1;
  const dayStartMin = state.settings.dayStart * 60;
  const dayEndMin = state.settings.dayEnd * 60;
  const currentMarker = getCurrentMarker();
  const minimumStart = currentMarker && currentMarker.day === day ? Math.max(dayStartMin, currentMarker.minutes) : dayStartMin;
  const maximumStart = dayEndMin - task.estimateMin;
  if (maximumStart < minimumStart) return "";

  const cursorY = Math.max(0, Math.min(rect.height, eventClientY(event) - rect.top));
  const rawMinutes = dayStartMin + Math.round(cursorY / pixelsPerMinute / 30) * 30;
  const snappedStart = Math.max(minimumStart, Math.min(rawMinutes, maximumStart));
  const start = fromMinutes(snappedStart);
  const excludedKey = originalPlacement ? (originalPlacement.key || scheduledKey(originalPlacement.taskId, originalPlacement.day, originalPlacement.start)) : null;
  return canPlaceTaskAt(task, day, start, getPlacementOccupiedSegments(), excludedKey) ? start : "";
}

function eventClientY(nativeEvent) {
  if (nativeEvent && typeof nativeEvent.clientY === "number") return nativeEvent.clientY;
  return 0;
}

function maybeAutoScrollDuringDrag(event) {
  const topEdge = 120;
  const bottomEdge = window.innerHeight - 120;
  const leftEdge = 100;
  const rightEdge = window.innerWidth - 100;
  const step = 10;
  const clientY = eventClientY(event);
  const clientX = typeof event?.clientX === "number" ? event.clientX : 0;

  if (clientY < topEdge) window.scrollBy(0, -step);
  else if (clientY > bottomEdge) window.scrollBy(0, step);

  const calendarShell = document.querySelector(".calendar-shell");
  if (!(calendarShell instanceof HTMLElement)) return;
  if (clientX < leftEdge) calendarShell.scrollLeft -= step;
  else if (clientX > rightEdge) calendarShell.scrollLeft += step;
}

function canPlaceTaskAt(task, day, start, occupied, excludedKey) {
  if (!task || !DAYS.includes(day)) return false;
  if (!Number.isFinite(task.estimateMin) || task.estimateMin <= 0) return false;
  const startClock = normalizeClock(start);
  if (!startClock) return false;

  const dayStartMin = state.settings.dayStart * 60;
  const dayEndMin = state.settings.dayEnd * 60;
  const startMin = toMinutes(startClock);
  const endMin = startMin + task.estimateMin;
  if (startMin < dayStartMin || endMin > dayEndMin) return false;

  const currentMarker = getCurrentMarker();
  if (currentMarker && DAYS.indexOf(day) < DAYS.indexOf(currentMarker.day)) return false;
  if (currentMarker && currentMarker.day === day && startMin < currentMarker.minutes) return false;

  return !occupied.some((segment) => {
    if (segment.day !== day) return false;
    if (excludedKey && segment.key === excludedKey) return false;
    const segmentStart = toMinutes(segment.start);
    const segmentEnd = toMinutes(segment.end);
    return startMin < segmentEnd && endMin > segmentStart;
  });
}

function upsertManualPlacement(task, day, start, originalPlacement = null) {
  const excludedKey = originalPlacement ? (originalPlacement.key || scheduledKey(originalPlacement.taskId, originalPlacement.day, originalPlacement.start)) : null;
  if (!canPlaceTaskAt(task, day, start, getPlacementOccupiedSegments(), excludedKey)) {
    return false;
  }

  let nextPlacements = [...state.manualPlacements];
  if (originalPlacement) {
    nextPlacements = nextPlacements.filter((placement) => !(placement.taskId === originalPlacement.taskId && placement.day === originalPlacement.day && placement.start === originalPlacement.start));
  }

  if (!taskAllowsMultiplePlacements(task)) {
    nextPlacements = nextPlacements.filter((placement) => placement.taskId !== task.id);
  }

  if (!nextPlacements.some((placement) => placement.taskId === task.id && placement.day === day && placement.start === start)) {
    nextPlacements.push({ taskId: task.id, day, start });
  }

  state.manualPlacements = nextPlacements;
  return true;
}

function getPlacementOccupiedSegments() {
  const occupied = [];
  if (state.plan?.fixedEvents?.length || state.plan?.assignedSegments?.length) {
    (state.plan.fixedEvents || []).forEach((event) => occupied.push({ day: event.day, start: event.start, end: event.end, key: event.id }));
    (state.plan.assignedSegments || []).forEach((segment) => occupied.push({ day: segment.day, start: segment.start, end: segment.end, key: segment.key || scheduledKey(segment.task.id, segment.day, segment.start) }));
    return occupied;
  }

  getRenderableFixedEvents().forEach((event) => occupied.push({ day: event.day, start: event.start, end: event.end, key: event.id }));
  state.manualPlacements.forEach((placement) => {
    const task = state.tasks.find((candidate) => candidate.id === placement.taskId);
    if (!task || !Number.isFinite(task.estimateMin) || task.estimateMin <= 0) return;
    occupied.push({
      day: placement.day,
      start: placement.start,
      end: fromMinutes(toMinutes(placement.start) + task.estimateMin),
      key: scheduledKey(placement.taskId, placement.day, placement.start)
    });
  });
  return occupied;
}

function findManualPlacement(taskId, day, start) {
  const found = state.manualPlacements.find((placement) => placement.taskId === taskId && placement.day === day && placement.start === start);
  return found ? { ...found, key: scheduledKey(found.taskId, found.day, found.start) } : null;
}

function findScheduledSegment(taskId, day, start) {
  return (state.plan?.assignedSegments || []).find((segment) => segment.task.id === taskId && segment.day === day && segment.start === start) || null;
}

function scheduledKey(taskId, day, start) {
  return `scheduled-${taskId}-${day}-${start}`;
}

function isTaskCompleted(taskId) {
  return state.completedTaskIds.includes(taskId);
}

function clearDropTargets() {
  document.querySelectorAll(".calendar-day-body.is-drop-target").forEach((node) => node.classList.remove("is-drop-target"));
}

function clearSummaryDropTargets() {
  document.querySelectorAll(".summary-card.is-drop-target").forEach((node) => node.classList.remove("is-drop-target"));
}

function onScreenshotUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    state.screenshotDataUrl = String(reader.result || "");
    renderScreenshotPreview();
    saveSession();
  };
  reader.readAsDataURL(file);
}

function importExtractionEvents() {
  const raw = els.extractionInput.value.trim();
  if (!raw) return setStatus("Paste extracted event JSON first.", "error");
  try {
    const parsed = JSON.parse(raw);
    const items = Array.isArray(parsed) ? parsed : parsed.events;
    if (!Array.isArray(items)) throw new Error("Extraction must be an array or { events: [] }.");
    const imported = items.map((item, index) => normalizeCalendarEvent(item, index + state.calendarEvents.length + 1)).filter(Boolean);
    if (!imported.length) throw new Error("No usable fixed events were found in the pasted extraction.");
    state.calendarEvents = [...state.calendarEvents, ...imported];
    if (parsed.currentTime) state.weeklyContext.currentTime = normalizeDateTimeLocal(parsed.currentTime);
    state.choices = {};
    setStatus(`Imported ${imported.length} fixed event${imported.length === 1 ? "" : "s"} from the extraction.`, "ok");
    buildAndRenderPlan();
  } catch (error) {
    setStatus(error.message || "Could not import the extracted events.", "error");
  }
}

function addManualEvent(event) {
  event.preventDefault();
  const title = document.getElementById("event-title").value.trim();
  const day = els.eventDay.value;
  const start = normalizeClock(document.getElementById("event-start").value);
  const end = normalizeClock(document.getElementById("event-end").value);
  const projectId = els.eventProject.value;
  if (!title || !day || !start || !end) return setStatus("Add a title, day, and valid start/end times first.", "error");
  if (toMinutes(end) <= toMinutes(start)) return setStatus("Event end time needs to be after the start time.", "error");
  state.calendarEvents.push({ id: uid("event"), title, day, start, end, projectId, fixed: true, notes: "", confidence: null });
  event.target.reset();
  hydrateDayOptions();
  renderProjectOptions();
  state.choices = {};
  setStatus("Added a fixed event.", "ok");
  buildAndRenderPlan();
}

function onEventEditorInput(event) {
  const card = event.target.closest("[data-event-id]");
  if (!card) return;
  const calendarEvent = state.calendarEvents.find((item) => item.id === card.dataset.eventId);
  if (!calendarEvent) return;
  const field = event.target.dataset.field;
  if (!field) return;
  calendarEvent[field] = field === "start" || field === "end" ? normalizeClock(event.target.value) : event.target.value;
  if (event.type === "change") {
    state.choices = {};
    buildAndRenderPlan();
  } else {
    saveSession();
  }
}

function onEventEditorClick(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  if (button.dataset.action === "delete-event") {
    state.calendarEvents = state.calendarEvents.filter((item) => item.id !== button.dataset.eventId);
    state.choices = {};
    buildAndRenderPlan();
  }
}

function onTaskEditorInput(event) {
  const card = event.target.closest("[data-task-id]");
  if (!card) return;
  const task = state.tasks.find((item) => item.id === card.dataset.taskId);
  if (!task) return;
  const field = event.target.dataset.field;
  if (!field) return;
    if (field === "estimateMin") task.estimateMin = normalizeEstimate(event.target.value);
    else if (field === "optional") {
      const nextOptional = Boolean(event.target.checked);
      const toggleError = getOptionalToggleError(task, nextOptional);
      if (toggleError) {
        event.target.checked = task.optional;
        setStatus(toggleError, "error");
        return;
      }
      task.optional = nextOptional;
    }
    else if (field === "actionable") task[field] = event.target.checked;
  else if (field === "dependsOnIds") task.dependsOnIds = event.target.value.split(",").map((value) => slugify(value)).filter(Boolean);
  else if (field === "urgency") task.urgency = normalizeUrgency(event.target.value);
  else if (field === "cadenceType") {
    task.cadenceType = normalizeCadenceType(event.target.value) || "once";
    if (task.cadenceType !== "routine") task.cadenceDays = null;
    else task.cadenceDays = normalizeCadenceDays(task.cadenceDays) || 1;
  }
  else if (field === "cadenceDays") {
    task.cadenceDays = normalizeCadenceDays(event.target.value) || 1;
  }
  else task[field] = event.target.value;
  if (event.type === "change") {
    state.choices = {};
    buildAndRenderPlan();
  } else {
    saveSession();
  }
}

function onTaskEditorClick() {}

function ensureProject(name) {
  return ensureProjectInCollection(state.projects, name);
}

function ensureProjectInCollection(collection, name) {
  const cleaned = String(name || "").trim();
  if (!cleaned) return "";
  const existing = collection.find((project) => project.name.toLowerCase() === cleaned.toLowerCase());
  if (existing) return existing.id;
  const project = { id: slugify(cleaned), name: cleaned };
  collection.push(project);
  return project.id;
}

function nextNewCategoryName() {
  const existing = new Set(state.projects.map((project) => project.name.toLowerCase()));
  if (!existing.has("new category")) return "New Category";
  let index = 2;
  while (existing.has(`new category ${index}`.toLowerCase())) index += 1;
  return `New Category ${index}`;
}

function createProjectViaPrompt() {
  const name = window.prompt("Name the new category:");
  if (!name) return null;
  const projectId = ensureProject(name);
  renderAll();
  saveSession();
  return projectId;
}

function setStatus(message, tone) {
  state.importStatus = message;
  state.importStatusTone = tone;
  renderImportStatus();
  saveSession();
}

function saveSession() {
  const snapshot = { bundleInput: state.bundleInput, extractionInput: state.extractionInput, projects: state.projects, tasks: state.tasks, calendarEvents: state.calendarEvents, weeklyContext: state.weeklyContext, screenshotDataUrl: state.screenshotDataUrl, settings: state.settings, choices: state.choices, manualPlacements: state.manualPlacements, completedTaskIds: state.completedTaskIds, hiddenFixedEventIds: state.hiddenFixedEventIds, importStatus: state.importStatus, importStatusTone: state.importStatusTone, showDetails: state.showDetails, boardView: state.boardView, importCollapsed: state.importCollapsed, expandedProjectIds: state.expandedProjectIds, userCreatedProjectIds: state.userCreatedProjectIds, taskSummaryAtEnd: state.taskSummaryAtEnd, summaryView: state.summaryView, addTaskMode: state.addTaskMode, renameCategoryMode: state.renameCategoryMode, deleteTaskMode: state.deleteTaskMode, treeEditMode: state.treeEditMode, treeParentTaskId: state.treeParentTaskId, timeEditMode: state.timeEditMode, deadlineEditMode: state.deadlineEditMode, optionalEditMode: state.optionalEditMode, taskAnchorOverrides: state.taskAnchorOverrides, anchorCelebrationById: state.anchorCelebrationById, recentCelebrations: state.recentCelebrations };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(snapshot));
}

  function restoreSession() {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return;
    try {
      Object.assign(state, JSON.parse(raw));
      state.settings = {
        dayStart: Number(state.settings?.dayStart) || 8,
        dayEnd: Number(state.settings?.dayEnd) || 22,
        useSystemTime: typeof state.settings?.useSystemTime === "boolean"
          ? state.settings.useSystemTime
          : !Boolean(normalizeDateTimeLocal(state.weeklyContext?.currentTime))
      };
      state.manualPlacements = Array.isArray(state.manualPlacements) ? state.manualPlacements : [];
      state.completedTaskIds = Array.isArray(state.completedTaskIds) ? state.completedTaskIds : [];
      state.hiddenFixedEventIds = Array.isArray(state.hiddenFixedEventIds) ? state.hiddenFixedEventIds : [];
        state.tasks = Array.isArray(state.tasks) ? state.tasks.map((task) => ({ ...task, ...deriveCadence(task) })) : [];
        state.expandedProjectIds = Array.isArray(state.expandedProjectIds) ? state.expandedProjectIds : [];
        state.userCreatedProjectIds = Array.isArray(state.userCreatedProjectIds) ? state.userCreatedProjectIds : [];
        state.dragTaskId = "";
        state.dragSource = "";
        state.taskSummaryAtEnd = state.taskSummaryAtEnd === true;
        state.summaryView = ["list", "tree"].includes(state.summaryView) ? state.summaryView : "tree";
        state.treeEditMode = state.treeEditMode === true;
        state.treeParentTaskId = typeof state.treeParentTaskId === "string" ? state.treeParentTaskId : "";
        state.timeEditMode = state.timeEditMode === true;
        state.deadlineEditMode = state.deadlineEditMode === true;
        state.optionalEditMode = state.optionalEditMode === true;
        state.addTaskMode = state.addTaskMode === true;
        state.renameCategoryMode = state.renameCategoryMode === true;
        state.deleteTaskMode = state.deleteTaskMode === true;
        state.taskAnchorOverrides = state.taskAnchorOverrides && typeof state.taskAnchorOverrides === "object" ? state.taskAnchorOverrides : {};
        state.anchorCelebrationById = state.anchorCelebrationById && typeof state.anchorCelebrationById === "object" ? state.anchorCelebrationById : {};
        state.recentCelebrations = Array.isArray(state.recentCelebrations) ? state.recentCelebrations : [];
        applyCurrentTimeMode();
      if (state.tasks.length || state.calendarEvents.length) state.plan = buildPlan();
    } catch {
      sessionStorage.removeItem(SESSION_KEY);
    }
  }

async function copyText(value) {
  if (!value) return;
  try {
    await navigator.clipboard.writeText(value);
    setStatus("Copied to clipboard.", "ok");
  } catch {
    setStatus("Could not copy automatically. You can still copy it manually.", "error");
  }
}

function makeWindow(day, startMin, endMin) {
  return { id: `${slugify(day)}-${fromMinutes(startMin)}-${fromMinutes(endMin)}`, day, start: fromMinutes(startMin), end: fromMinutes(endMin), durationMin: endMin - startMin };
}

function itemPriority(kind) {
  return { now: 0, fixed: 1, assigned: 2, open: 3 }[kind] ?? 9;
}

function getProjectColor(projectId) {
  if (!projectId) return "#9b8d7d";
  const index = state.projects.findIndex((project) => project.id === projectId);
  return PROJECT_COLORS[(index >= 0 ? index : 0) % PROJECT_COLORS.length];
}

function getProjectName(projectId) {
  return state.projects.find((project) => project.id === projectId)?.name || "";
}

function buildItemTooltip(title, start, end, category, notes) {
  return [title, `${prettyTime(start)} - ${prettyTime(end)}`, category, notes].filter(Boolean).join("\n");
}

function hexToRgba(hex, alpha) {
  const cleaned = String(hex || "").replace("#", "");
  if (![3, 6].includes(cleaned.length)) return `rgba(36, 49, 51, ${alpha})`;
  const expanded = cleaned.length === 3 ? cleaned.split("").map((part) => part + part).join("") : cleaned;
  const int = Number.parseInt(expanded, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function inferDayFromDate(value) {
  const normalized = normalizeDateTimeLocal(value) || String(value || "");
  if (!normalized) return "";
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return "";
  return DAYS[(date.getDay() + 6) % 7];
}

  function normalizeDateTimeLocal(value) {
    if (!value) return "";
    const raw = String(value).trim();
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(raw)) return raw;
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return "";
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  const hours = String(parsed.getHours()).padStart(2, "0");
    const minutes = String(parsed.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  function getRoundedSystemDateTimeLocal() {
    const now = new Date();
    now.setMinutes(0, 0, 0);
    return normalizeDateTimeLocal(now);
  }

  function applyCurrentTimeMode() {
    if (state.settings.useSystemTime) {
      state.weeklyContext.currentTime = getRoundedSystemDateTimeLocal();
      state.weeklyContext.currentTimeSource = "system";
      state.weeklyContext.currentTimeConfidence = 1;
      if (!state.weeklyContext.timezone) {
        state.weeklyContext.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      }
      return;
    }
    state.weeklyContext.currentTime = normalizeDateTimeLocal(state.weeklyContext.currentTime);
    if (!state.weeklyContext.currentTime && state.weeklyContext.currentTimeSource === "system") {
      state.weeklyContext.currentTimeSource = "";
      state.weeklyContext.currentTimeConfidence = null;
    }
  }

function normalizeClock(value) {
  if (!value && value !== 0) return "";
  const match = String(value).trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return "";
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return "";
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

  function normalizeEstimate(value) {
    if (value === null || value === undefined || value === "") return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }

  function compactTaskLabel(value) {
    const raw = String(value || "").trim();
    if (raw.length <= 20) return raw;
    return `${raw.slice(0, 17).trimEnd()}...`;
  }

  function compareEvents(left, right) {
  return DAYS.indexOf(left.day) - DAYS.indexOf(right.day) || toMinutes(left.start) - toMinutes(right.start);
}

function isUsableEvent(event) {
  return event && DAYS.includes(event.day) && normalizeClock(event.start) && normalizeClock(event.end) && toMinutes(event.end) > toMinutes(event.start);
}

function toMinutes(time) {
  const [hours, minutes] = String(time).split(":").map(Number);
  return hours * 60 + minutes;
}

function fromMinutes(total) {
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function prettyTime(time) {
  const [hour, minute] = String(time).split(":").map(Number);
  const period = hour >= 12 ? "PM" : "AM";
  const normalizedHour = hour % 12 || 12;
  return `${normalizedHour}:${String(minute).padStart(2, "0")} ${period}`;
}

function uid(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function slugify(value) {
  return String(value || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").replace(/-{2,}/g, "-");
}

function toCamel(value) {
  return value.replace(/-([a-z])/g, (_, character) => character.toUpperCase());
}

function escapeHtml(value) {
  return String(value || "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("'", "&#39;");
}
