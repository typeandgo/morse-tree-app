import type { Messages } from "./types";

export const tr: Messages = {
  meta: {
    appTitle: "Morse Tree",
    aboutTitle: "Hakkında — Morse Tree",
    settingsTitle: "Ayarlar — Morse Tree",
  },
  common: {
    back: "Geri",
    push: "PUSH",
    menu: "Menü",
    menuNav: "Sayfa menüsü",
    morseTree: "Morse Tree",
    try: "Dene",
    language: "Dil",
    dot: "DOT",
    dash: "DASH",
    ms: "ms",
  },
  nav: {
    about: "Hakkında",
    settings: "Ayarlar",
  },
  about: {
    title: "Hakkında",
    lead: "Morse Tree, morse alfabesini görsel bir ağaç üzerinde öğrenmenize yardımcı olan interaktif bir uygulamadır.",
    howToTitle: "Nasıl kullanılır?",
    usageShort: "{push} düğmesine kısa basın — nokta ({dot})",
    usageLong: "{push} düğmesine biraz daha uzun basılı tutun — çizgi ({dash})",
    usageQueue: "Girdiğiniz semboller ağaçta ilgili yolu aydınlatır; birkaç sembolden sonra kısa bir süre bekleyince harf tamamlanır",
    usageCooldown: "Harf tamamlandığında düğme kısa bir süreliğine devre dışı kalır, ardından yeni bir harfe başlayabilirsiniz",
    treeTitle: "Ağaç yapısı",
    treeText: "Her harf, antenden (kök) başlayan nokta ve çizgi dallarıyla tanımlanır. Doğru morse dizisini girdiğinizde yol boyunca node ve çizgiler yanar; doğru harf kalıcı olarak vurgulanır.",
    treeNote: "Hızı {settings} sayfasından değiştirebilirsiniz.",
  },
  settings: {
    title: "Ayarlar",
    lead: "Hızı WPM (dakikada kelime) cinsinden ayarlayın. Tüm zamanlama değerleri standart PARIS Morse zamanlaması kullanılarak otomatik olarak türetilir.",
    speedTitle: "Hız",
    soundTitle: "Ses",
    resetTiming: "Hızı varsayılana sıfırla",
    resetSound: "Sesi varsayılanlara sıfırla",
    wpm: {
      label: "Hız (WPM)",
      unit: "WPM",
      format: "{value} WPM",
    },
    derived: {
      unit: "Dit (birim)",
      dot: "DOT aralığı",
      dash: "DASH aralığı",
      gap: "Sembol boşluğu",
    },
    gapMultiplier: {
      label: "Boşluk Çarpanı",
      format: "×{value}",
    },
    endOfQueueDuration: {
      label: "Bekleme Süresi",
      format: "{value} ms",
    },
    sound: {
      previewDot: "{dot} dinle",
      previewDash: "{dash} dinle",
      frequencyHz: {
        label: "Ton frekansı",
        format: "{value} Hz",
      },
    },
  },
};
