# Tournament Generator — Issue Backlog

Generated: 2026-03-01

A prioritized audit of bugs, best-practice violations, and technical debt found in the codebase.
Issues are grouped by severity and ordered within each group by impact.

---

## Critical — Functional Bugs

These issues cause incorrect behaviour or data loss in normal use.

### 1. `saveTournament` silently discards new tournaments

**File:** `src/logic/persistance.ts:19`

`Array.map` is used to update an existing entry. If no match is found the original array is written back unchanged — the new tournament is never persisted. Creating a tournament from the UI appears to succeed but nothing is saved.

**Fix:** Use an upsert pattern — replace the matched entry or append if not found.

---

### 2. `getTournament` always returns `undefined`

**File:** `src/logic/persistance.ts:14`

The `.find()` callback uses a block body `{ tournament.name === name }` instead of an expression body. The comparison result is discarded; the callback returns `undefined` implicitly, so `.find()` always returns `undefined`. The outer function also lacks a `return` statement.

**Fix:** `existingTournaments.find((tournament) => tournament.name === name)` and add `return`.

---

### 3. `sortedParticipants` never updated after participants are added or removed

**File:** `src/components/TournamentStrongman.tsx:58`

`sortedParticipants` is initialised once from `tournament.participants`. `updateParticipants` calls `setTournament` but never calls `setSortedParticipants`. Newly added participants are invisible in the table; deleted participants keep appearing until the page is reloaded.

**Fix:** Call `setSortedParticipants([...updatedTournament.participants])` inside `updateParticipants` and `handleDeleteParticipant`.

---

### 4. Shallow copy + `.push()` mutates React state array directly

**File:** `src/components/TournamentStrongman.tsx:70`

`{ ...tournament }` produces a shallow copy. `currentTournament.participants` is the **same array reference** as the React state. Calling `.push()` mutates state in place before `setTournament` is called, bypassing React's change detection.

**Fix:** `const participants = [...tournament.participants, ...newParticipants.split(',').filter(p => p.trim())]`

---

### 5. Nested `eventResults` object mutated before `setTournament`

**File:** `src/components/TournamentStrongman.tsx:89`

The shallow copy means `currentTournament.eventResults` is the same object reference as `tournament.eventResults`. Every property assignment on it mutates existing React state directly. `calculatePoints` compounds this by also mutating `eventResults` in place (`resultCalculation.ts:10`).

**Fix:** Deep-copy the relevant nested objects before modifying them.

---

### 6. `sortByPoints` crashes when results have not been entered yet

**File:** `src/components/TournamentStrongman.tsx:113`

Clicking a column header before scores are entered calls `tournament.overall![a].points` where `tournament.overall` is `undefined`. The `!` non-null assertion suppresses the TypeScript error but not the runtime `TypeError`. `tournament.eventResults![property]` is similarly unsafe.

**Fix:** Guard with `if (!tournament.overall || !tournament.eventResults?.[property]) return 0` before sorting.

---

### 7. `Array.sort()` mutates `tournament.participants` state in place

**File:** `src/components/TournamentStrongman.tsx:130`

`Array.prototype.sort` sorts in place and returns the same array reference. `tournament.participants` is React state and must not be mutated directly.

**Fix:** `const ordered = [...tournament.participants].sort(sortByPoints(property, isAsc))`

---

## High — Data Integrity and Error Handling

### 8. All `JSON.parse(localStorage.getItem(...))` calls are unguarded

**Files:** `src/logic/persistance.ts:6`, `src/components/TournamentCreationModal.tsx:42`, `src/components/Tournament.tsx:9`, `src/components/ExistingTournaments.tsx:7`, `src/components/TournamentOverview.tsx:25`

`JSON.parse` throws `SyntaxError` on malformed input. None of the five call sites wraps this in `try/catch`. Corrupted localStorage (e.g., from a partial write or browser extension) makes the entire app unusable. The AGENTS.md guidelines explicitly require this guard.

**Fix:** Wrap every `JSON.parse(localStorage.getItem(...))` in a `try/catch` that falls back to a safe default.

---

### 9. `handleDeleteParticipant` deletes from stale props, not current state

**File:** `src/components/ParticipantsModal.tsx:32`

`participants` is destructured from props once. After the first deletion, subsequent deletions filter from the original list, restoring previously deleted participants. The function also directly mutates `tournament.participants` via prop assignment — a React anti-pattern.

**Fix:** Use `currentParticipants` (the component's own state) as the source for filtering, and propagate changes via a callback prop rather than prop mutation.

---

### 10. `NaN` stored as performance value without validation

**File:** `src/components/TournamentStrongman.tsx:89` / `src/logic/resultCalculation.ts:48`

`parseFloat('')` returns `NaN`. An empty input field stores `NaN` as the performance. `NaN !== 0` so `setZeros` does not zero the entry, and `NaN - x = NaN` breaks sort ordering, producing non-deterministic point assignments.

**Fix:** Validate the parsed value with `isNaN(value)` and either reject or treat as `0`.

---

### 11. `getEventResult` crashes on an empty results object

**File:** `src/logic/resultCalculation.ts:51`

If `eventResults[event.name]` is an empty object `{}`, `sortedEntries` is `[]` and `sortedEntries[0][1].performance` throws `TypeError`. The guard on line 8 passes for `{}` (truthy).

**Fix:** Add `if (Object.keys(eventResults[event.name]).length === 0) return {}` after the existing guard.

---

### 12. No duplicate tournament name validation

**File:** `src/components/TournamentCreationModal.tsx:30`

`validateTournamentName` only checks for an empty string. Creating two tournaments with the same name produces two localStorage entries; `saveTournament` (once fixed) will only update the first match, and both appear in the list at the same route.

**Fix:** Check existing tournament names in `validateTournamentName` and show an error message if the name is taken.

---

### 13. localStorage access is scattered across the codebase, bypassing `persistance.ts`

**Files:** `src/components/TournamentCreationModal.tsx:42`, `src/components/Tournament.tsx:9`, `src/components/ExistingTournaments.tsx:7`, `src/components/TournamentOverview.tsx:25`

The key `'existingTournaments'` is a raw string literal repeated in six places. Four components access localStorage directly instead of using the functions in `persistance.ts`. Any schema change, key rename, or error-handling improvement requires edits in all six locations.

**Fix:** Add `createTournament`, `deleteTournament`, and `getAllTournaments` functions to `persistance.ts` and migrate all components to use them exclusively.

---

## Medium — React Patterns and UX

### 14. Stale modal state on re-open (`ParticipantsModal` and `EventsModal`)

**Files:** `src/components/ParticipantsModal.tsx:30`, `src/components/EventsModal.tsx:29`

MUI `Modal` does not unmount its children when closed — it only hides them. `useState(participants)` and `useState(tournament.events)` are each called only once on initial mount. If the underlying data changes between opens the modal shows stale content.

**Fix:** Add a `useEffect` that syncs local state to props whenever the modal `open` prop transitions to `true`.

---

### 15. `window.location.reload()` used as a state management workaround

**Files:** `src/components/TournamentStrongman.tsx:109`, `src/components/TournamentOverview.tsx:30`

A hard page reload is used after clearing results and after deleting a tournament instead of updating React state. This causes full re-initialisation of all component state.

**Fix:** After `clearResults`, reset `tournament` and `sortedParticipants` via their setters. After deletion, lift tournament list state to a common ancestor or use a context so the list re-renders reactively.

---

### 16. `localStorage` read at component function body level, not in `useEffect`

**Files:** `src/components/ExistingTournaments.tsx:7`, `src/components/Tournament.tsx:9`

Reading from `localStorage` at the top level of a component runs on every render. It also means the data is never reactively refreshed without a manual reload.

**Fix:** Read initial state via the `useState` initializer (`useState(() => getExistingTournaments())`) or inside `useEffect`.

---

### 17. Tournament names not URL-encoded in navigation

**Files:** `src/components/TournamentCreationModal.tsx:48`, `src/components/TournamentOverview.tsx:17`

`navigate(\`/tournament/${name}\`)`will produce a broken URL if the name contains`#`, `?`, or `&`.

**Fix:** Use `encodeURIComponent(name)` when navigating and `decodeURIComponent(useParams().name)` on the receiving side.

---

### 18. `window.confirm()` and `alert()` used for user interaction

**Files:** `src/components/TournamentStrongman.tsx:101`, `src/components/TournamentOverview.tsx:22`, `src/components/TournamentCreationModal.tsx:24`

Native blocking dialogs are unstyled, inconsistent with the MUI design system, inaccessible in some browsers, and can be suppressed by browser settings.

**Fix:** Replace with MUI `Dialog` for confirmations and `Snackbar`/`Alert` for informational messages.

---

### 19. No proper not-found state for unknown tournament routes

**File:** `src/components/Tournament.tsx:19`

If a URL references an unknown tournament name, the `default` branch renders a plain `<div>No tournament type found.</div>` with no navigation option.

**Fix:** Render a proper error state with a link back to the home page.

---

### 20. `CUSTOM` event type always sorted as higher-is-better

**File:** `src/logic/resultCalculation.ts:85`

The `CUSTOM` case falls through to `default: return true`. There is no way for users to configure sort direction for custom events.

**Fix:** Add a `higherIsBetter` boolean field to `StrongmanEvent` and use it in `isHigherBetter` for the `CUSTOM` case.

---

### 21. `TournamentCreationModal` form state not reset on cancel/close

**File:** `src/components/TournamentCreationModal.tsx`

Reopening the modal after a cancelled attempt shows the previously typed name.

**Fix:** Reset `tournamentName` and `selectedType` to defaults in the `onClose` handler.

---

## Low — Code Quality and Technical Debt

### 22. `persistance.ts` filename is misspelled

**File:** `src/logic/persistance.ts`

The correct spelling is `persistence.ts`. The typo propagates to every import statement.

---

### 23. `makeStyles` from `@mui/styles` is deprecated in MUI v6

**Files:** `src/components/LandingPage.tsx:8`, `src/components/TournamentStrongman.tsx:27`

`@mui/styles` is the legacy JSS-based system from MUI v4 and is incompatible with React 19's concurrent features. MUI v6 recommends the `sx` prop or `styled()` from `@mui/material/styles`.

---

### 24. Deprecated MUI v5 `Grid` API (`item`, `xs`/`sm`/`md` props)

**File:** `src/components/ExistingTournaments.tsx:10`

MUI v6 has migrated to `Grid2`. The `item` prop and shorthand breakpoint props on `Grid` are the legacy v5 API.

---

### 25. `key={index}` on all list renders

**Files:** `src/components/TournamentStrongman.tsx:158,198,213`, `src/components/EventsModal.tsx:55`, `src/components/ParticipantsModal.tsx:51`, `src/components/ExistingTournaments.tsx:17`

Using array indices as keys causes incorrect DOM reconciliation when items are reordered or deleted.

**Fix:** Use stable unique identifiers — `tournament.name`, `event.name`, participant string value.

---

### 26. `@types/react@^18` used with `react@^19`

**File:** `package.json:18,27`

React 19 introduced new APIs and changed some type signatures. Using v18 types may suppress valid errors or produce incorrect type information.

---

### 27. `@types/jest` installed in a Vitest project

**File:** `package.json:27`

`@types/jest` provides Jest global types. The project uses Vitest. This package is unused and may interfere with type resolution.

---

### 28. Development tools in `dependencies` instead of `devDependencies`

**File:** `package.json:13`

`eslint`, `prettier`, and `eslint-config-prettier` are listed under `"dependencies"`. They will be included in production installs unnecessarily.

---

### 29. `add` package is an accidental install

**File:** `package.json:33`

`"add": "^2.0.6"` is almost certainly installed by accident (running `npm add` instead of `npm install`). It serves no purpose in this project.

---

### 30. `TournamentOverview` `type` prop typed as `string` instead of `TournamentTypes`

**File:** `src/components/TournamentOverview.tsx:9`

The `Tournament` type uses the `TournamentTypes` enum. Widening the prop to `string` loses type safety.

---

### 31. Inline anonymous type instead of `Tournament` in `ExistingTournaments`

**File:** `src/components/ExistingTournaments.tsx:16`

`{ name: string; participants: string[]; type: string }` is a partial re-definition of the existing `Tournament` type. Changes to `Tournament` will not be reflected here.

---

### 32. `vitest.config.ts` missing `tsconfigPaths` plugin

**File:** `vitest.config.ts`

`vite.config.ts` includes `tsconfigPaths()` so path aliases work in the app. `vitest.config.ts` does not. Any test using a path alias import would fail to resolve. Current tests work around this with relative imports.

---

### 33. `vitest.config.ts` uses `environment: 'node'`

**File:** `vitest.config.ts:6`

No DOM API is available. Any future component tests using React Testing Library would fail silently or error. `environment: 'jsdom'` is the standard for React projects.

---

### 34. Very thin test coverage

**File:** `src/tests/resultCalculation.test.ts`

Untested areas include: `getTournament`, `saveTournament`, `getExistingTournaments`, `calculatePoints` overall/place fields, `CUSTOM` event type, empty results object, `NaN` performance input, and all React components.

---

### 35. Redundant `handleNewTournament` wrapper

**File:** `src/components/LandingPage.tsx:80`

`const handleNewTournament = () => { handleOpenModal(); }` adds no behaviour. The `onClick` can reference `handleOpenModal` directly.

---

### 36. Background gradient duplicated

**Files:** `src/App.tsx:31`, `src/components/LandingPage.tsx:20`

The same `linear-gradient` with the hardcoded hex `#fcdcd6` is defined in two places.

---

### 37. Unused CSS classes in `LandingPage`

**File:** `src/components/LandingPage.tsx:53`

`modal` and `paper` classes are defined in `useStyles` but never referenced.

---

### 38. Mixed `React.useState` and `useState` in the same file

**File:** `src/components/TournamentStrongman.tsx:56`

Both namespace-access and destructured import styles are used in the same component. Pick one.

---

### 39. Inconsistent import style (relative vs path alias)

**Files:** `src/logic/resultCalculation.ts:1`, `src/logic/persistance.ts:1`, `src/components/Tournament.tsx:4`, `src/tests/resultCalculation.test.ts:4`, `src/Routes.tsx:4`

AGENTS.md requires path aliases (`'types'`, `'logic/*'`). Several files use relative imports (`'../types'`, `'../logic/resultCalculation'`).

---

### 40. Stale file-path comment in test file

**File:** `src/tests/resultCalculation.test.ts:1`

`// src/utils/__tests__/tournament.test.ts` is the wrong path — leftover from scaffolding.

---

### 41. `getEventResult` describe block is not nested inside `Tournament Functions`

**File:** `src/tests/resultCalculation.test.ts:46`

The `describe('getEventResult', ...)` block sits at the top level. It appears to be intended as a sibling of `describe('calculatePoints', ...)` inside `describe('Tournament Functions', ...)`.

---

### 42. `moduleResolution: "Node"` is outdated

**File:** `tsconfig.json:13`

The legacy Node resolution algorithm is used. For a modern Vite + ESM project, `"Bundler"` (TypeScript 5+) is recommended.

---

### 43. TypeScript 4.9 outdated for MUI v6 and React 19

**File:** `package.json:36`

MUI v6 and React 19 both officially recommend TypeScript 5.x. TS 4.9 is missing the `satisfies` operator and has weaker inference in some areas.

---

### 44. MUI `Modal` components missing `aria-labelledby` / `aria-describedby`

**Files:** `src/components/TournamentCreationModal.tsx:52`, `src/components/EventsModal.tsx:49`, `src/components/ParticipantsModal.tsx:40`

Screen reader users receive no announcement when these dialogs open. MUI's own documentation requires these attributes.

---

### 45. Clickable `Card` not keyboard accessible

**File:** `src/components/TournamentOverview.tsx:35`

An `onClick` on a `<div>`-based `Card` is not reachable via keyboard. Use MUI `CardActionArea`, which provides the correct role and keyboard handling out of the box.

---

### 46. Non-descriptive `alt` text on trophy image

**File:** `src/components/LandingPage.tsx:86`

`alt="Welcome"` does not describe the image. Use `alt="Trophy"` or `alt="Tournament trophy icon"`.

---

## Summary

| #   | Severity | File                                              | Issue                                                                |
| --- | -------- | ------------------------------------------------- | -------------------------------------------------------------------- |
| 1   | Critical | `persistance.ts:19`                               | `saveTournament` silently discards new tournaments                   |
| 2   | Critical | `persistance.ts:14`                               | `getTournament` always returns `undefined`                           |
| 3   | Critical | `TournamentStrongman.tsx:58`                      | `sortedParticipants` not updated after participant changes           |
| 4   | Critical | `TournamentStrongman.tsx:70`                      | Shallow copy + `.push()` mutates state array                         |
| 5   | Critical | `TournamentStrongman.tsx:89`                      | Shallow copy causes nested state mutation                            |
| 6   | Critical | `TournamentStrongman.tsx:113`                     | `sortByPoints` crashes before results exist                          |
| 7   | Critical | `TournamentStrongman.tsx:130`                     | `Array.sort()` mutates state in place                                |
| 8   | High     | Multiple                                          | Unguarded `JSON.parse(localStorage...)` — no `try/catch`             |
| 9   | High     | `ParticipantsModal.tsx:32`                        | Delete filters from stale props; direct prop mutation                |
| 10  | High     | `TournamentStrongman.tsx:89`                      | `NaN` stored as performance without validation                       |
| 11  | High     | `resultCalculation.ts:51`                         | Crash on empty results object                                        |
| 12  | High     | `TournamentCreationModal.tsx:30`                  | No duplicate name validation                                         |
| 13  | High     | Multiple                                          | localStorage scattered across components, bypassing `persistance.ts` |
| 14  | Medium   | `ParticipantsModal.tsx:30` / `EventsModal.tsx:29` | Stale modal state on re-open                                         |
| 15  | Medium   | `TournamentStrongman.tsx:109`                     | `window.location.reload()` as state workaround                       |
| 16  | Medium   | `ExistingTournaments.tsx:7`                       | localStorage read on every render                                    |
| 17  | Medium   | `TournamentCreationModal.tsx:48`                  | Tournament names not URL-encoded                                     |
| 18  | Medium   | Multiple                                          | `window.confirm()` / `alert()` instead of MUI dialogs                |
| 19  | Medium   | `Tournament.tsx:19`                               | No proper not-found state                                            |
| 20  | Medium   | `resultCalculation.ts:85`                         | `CUSTOM` event always higher-is-better                               |
| 21  | Medium   | `TournamentCreationModal.tsx`                     | Form not reset on close                                              |
| 22  | Low      | `persistance.ts`                                  | Filename misspelling                                                 |
| 23  | Low      | `LandingPage.tsx:8`                               | Deprecated `makeStyles` from `@mui/styles`                           |
| 24  | Low      | `ExistingTournaments.tsx:10`                      | Deprecated MUI v5 Grid API                                           |
| 25  | Low      | Multiple                                          | `key={index}` on all list renders                                    |
| 26  | Low      | `package.json`                                    | `@types/react@^18` with `react@^19`                                  |
| 27  | Low      | `package.json`                                    | `@types/jest` in a Vitest project                                    |
| 28  | Low      | `package.json`                                    | Dev tools in `dependencies`                                          |
| 29  | Low      | `package.json`                                    | `add` package — accidental install                                   |
| 30  | Low      | `TournamentOverview.tsx:9`                        | `type` prop typed as `string` not `TournamentTypes`                  |
| 31  | Low      | `ExistingTournaments.tsx:16`                      | Inline anonymous type instead of `Tournament`                        |
| 32  | Low      | `vitest.config.ts`                                | Missing `tsconfigPaths` plugin                                       |
| 33  | Low      | `vitest.config.ts:6`                              | `environment: 'node'` blocks component tests                         |
| 34  | Low      | `resultCalculation.test.ts`                       | Very thin test coverage                                              |
| 35  | Low      | `LandingPage.tsx:80`                              | Redundant `handleNewTournament` wrapper                              |
| 36  | Low      | `App.tsx:31` / `LandingPage.tsx:20`               | Background gradient duplicated                                       |
| 37  | Low      | `LandingPage.tsx:53`                              | Unused CSS classes                                                   |
| 38  | Low      | `TournamentStrongman.tsx:56`                      | Mixed `React.useState` / `useState`                                  |
| 39  | Low      | Multiple                                          | Inconsistent relative vs path-alias imports                          |
| 40  | Low      | `resultCalculation.test.ts:1`                     | Stale file-path comment                                              |
| 41  | Low      | `resultCalculation.test.ts:46`                    | `getEventResult` describe block at wrong nesting level               |
| 42  | Low      | `tsconfig.json:13`                                | Outdated `moduleResolution: "Node"`                                  |
| 43  | Low      | `package.json:36`                                 | TypeScript 4.9 outdated                                              |
| 44  | Low      | Modal components                                  | Missing `aria-labelledby` / `aria-describedby`                       |
| 45  | Low      | `TournamentOverview.tsx:35`                       | Clickable `Card` not keyboard accessible                             |
| 46  | Low      | `LandingPage.tsx:86`                              | Non-descriptive image `alt` text                                     |
