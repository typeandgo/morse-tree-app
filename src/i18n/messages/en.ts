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
    usageShort: "Tap {push} briefly — dot ({dot})",
    usageLong: "Hold {push} a bit longer — dash ({dash})",
    usageQueue: "Symbols light up the path on the tree; pause briefly after a few symbols and the letter completes",
    usageCooldown: "Once a letter completes, the button stays disabled briefly before you can start the next one",
    treeTitle: "Tree structure",
    treeText: "Each letter is defined by dot and dash branches from the antenna (root). When you enter the correct morse sequence, nodes and lines along the path light up and the correct letter stays highlighted.",
    treeNote: "Change speed on the {settings} page.",
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
    },
    gapMultiplier: {
      label: "Gap Multiplier",
      format: "×{value}",
    },
    endOfQueueDuration: {
      label: "Cooldown Duration",
      format: "{value} ms",
    },
    sound: {
      previewDot: "Preview {dot}",
      previewDash: "Preview {dash}",
      frequencyHz: {
        label: "Tone frequency",
        format: "{value} Hz",
      },
    },
  },
};
