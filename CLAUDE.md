@AGENTS.md

# Project relationship: Next.js is the master

`morse-tree-next` is the master project. `morse-tree-app` (this project) is a port of it.

## App-specific overrides

These values intentionally differ from the master project and must NOT be overwritten when porting:

- `WPM_MIN = 1`, `WPM_MAX = 25` (Next uses 10–40; app targets slower learners)
- `endOfQueueDuration` (cooldown after queue completes) is a user-adjustable setting in `MorseSettings` here (500–2000ms, 100ms step, default 1000ms, via a settings slider), not a hardcoded `getDurationEndOfQueue()` constant. This was added app-only per explicit user request; do not overwrite with the Next version when porting `morse-settings.ts`.

## What flows from Next → App

Business logic and settings always originate in `morse-tree-next` and are ported to this project:

- Timing constants and calculations (`morse-settings.ts`)
- Audio constants and normalization logic (`morse-audio-settings.ts`)
- Morse code mappings, path-building, and tree structure (`morse-mappings.ts`)
- Morse timing utilities (`morse-timing.ts`)
- Game hook logic (`useMorseGame.ts`) — porting changes from Next, not the other way around
- i18n keys and message shapes (types first, then locale files)
- Settings types and defaults

When the master project changes any of the above, mirror those changes here. Do not invent diverging logic in the app for things that belong to the shared domain.

## What stays in the App

Do not overwrite app-specific code with Next.js equivalents:

- All UI components (React Native / Expo primitives, StyleSheet, layout)
- App-specific event handling: `onPressIn` / `onPressOut` (not web `onPointerDown`/`onPointerUp`)
- Navigation (`expo-router` routes and layouts)
- Haptics, native audio APIs, and any Expo SDK usage
- App-specific context providers and their React Native wiring
