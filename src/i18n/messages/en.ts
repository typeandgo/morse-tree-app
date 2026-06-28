import type { Messages } from "./types";

export const en: Messages = {
  meta: {
    appTitle: "Morse Tree",
    aboutTitle: "About — Morse Tree",
    settingsTitle: "Settings — Morse Tree",
  },
  common: {
    back: "Back",
    push: "PUSH",
    menu: "Menu",
    menuNav: "Page menu",
    morseTree: "Morse Tree",
    try: "Try",
    language: "Language",
    dot: "DOT",
    dash: "DASH",
    ms: "ms",
  },
  nav: {
    about: "About",
    settings: "Settings",
  },
  about: {
    title: "About",
    lead: "Morse Tree is an interactive app that helps you learn the morse alphabet on a visual tree.",
    howToTitle: "How to use",
    usageShort: "Press {push} briefly (≤{dotMax} ms) — dot ({dot})",
    usageLong: "Press {push} longer ({dashMin} ms or more, up to {dashMax} ms) — dash ({dash})",
    usageQueueWait: "Symbols light the path on the tree; waiting {duration} ms between symbols completes the queue",
    usageQueueGap: "Leaving more than {duration} ms between presses completes the queue",
    usageCooldown: "After the queue completes, the button stays disabled for {duration} ms",
    treeTitle: "Tree structure",
    treeText: "Each letter is defined by dot and dash branches from the antenna (root). When you enter the correct morse sequence, nodes and lines along the path light up and the correct letter stays highlighted. Change speed on the {settings} page; values on this page always reflect your latest settings.",
  },
  settings: {
    title: "Settings",
    lead: "Adjust speed in WPM (words per minute). All timing values are derived automatically using standard PARIS Morse timing.",
    speedTitle: "Speed",
    soundTitle: "Sound",
    resetTiming: "Reset speed to default",
    resetSound: "Reset sound to defaults",
    wpm: {
      label: "Speed (WPM)",
      unit: "WPM",
      format: "{value} WPM",
    },
    derived: {
      unit: "Dit (unit)",
      dot: "DOT range",
      dash: "DASH range",
      gap: "Symbol gap",
      cooldown: "Cooldown",
    },
    sound: {
      enabled: "Sound on",
      previewDot: "Preview {dot}",
      previewDash: "Preview {dash}",
      waveSquare: "Square",
      waveSine: "Sine",
      volume: {
        label: "Volume",
        format: "{value}%",
      },
      frequencyHz: {
        label: "Tone frequency",
        format: "{value} Hz",
      },
    },
  },
};
