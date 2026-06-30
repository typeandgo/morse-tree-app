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
    usageShort: "{push} düğmesine kısa basın (≤{dotMax} ms) — nokta ({dot})",
    usageLong: "{push} düğmesine uzun basın ({dashMin} ms ve üzeri, en fazla {dashMax} ms) — çizgi ({dash})",
    usageQueueWait: "Semboller ağaçta ilgili yolu aydınlatır; semboller arasında {duration} ms beklediğinizde kuyruk tamamlanır",
    usageQueueGap: "Basışlar arasında {duration} ms'den fazla boşluk bırakırsanız kuyruk tamamlanır",
    usageCooldown: "Kuyruk tamamlandıktan sonra düğme {duration} ms boyunca devre dışı kalır",
    treeTitle: "Ağaç yapısı",
    treeText: "Her harf, antenden (kök) başlayan nokta ve çizgi dallarıyla tanımlanır. Doğru morse dizisini girdiğinizde yol boyunca node ve çizgiler yanar; doğru harf kalıcı olarak vurgulanır.",
    treeNote: "Hızı {settings} sayfasından değiştirebilirsiniz; bu sayfadaki değerler her zaman son ayarlarınızı yansıtır.",
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
      cooldown: "Bekleme süresi",
    },
    gapMultiplier: {
      label: "Boşluk Çarpanı",
      format: "×{value}",
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
