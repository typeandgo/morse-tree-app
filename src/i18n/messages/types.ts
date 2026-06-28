export type Messages = {
  meta: {
    appTitle: string;
    aboutTitle: string;
    settingsTitle: string;
  };
  common: {
    back: string;
    push: string;
    menu: string;
    menuNav: string;
    morseTree: string;
    try: string;
    language: string;
    dot: string;
    dash: string;
    ms: string;
  };
  nav: {
    about: string;
    settings: string;
  };
  about: {
    title: string;
    lead: string;
    howToTitle: string;
    usageShort: string;
    usageLong: string;
    usageQueueWait: string;
    usageQueueGap: string;
    usageCooldown: string;
    treeTitle: string;
    treeText: string;
  };
  settings: {
    title: string;
    lead: string;
    speedTitle: string;
    soundTitle: string;
    resetTiming: string;
    resetSound: string;
    wpm: {
      label: string;
      unit: string;
      format: string;
    };
    derived: {
      unit: string;
      dot: string;
      dash: string;
      gap: string;
      cooldown: string;
    };
    sound: {
      enabled: string;
      previewDot: string;
      previewDash: string;
      waveSquare: string;
      waveSine: string;
      volume: {
        label: string;
        format: string;
      };
      frequencyHz: {
        label: string;
        format: string;
      };
    };
  };
};
