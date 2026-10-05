/* =========================================================
   عدّل معلومات العرس من هذا الملف فقط
   ========================================================= */
const WEDDING = {
  groom: "المهندس نور الدين بيرقدار",
  bride: "الآنسة بُشرى كلاوي",
  monogram: "N ♡ B", // الأحرف على ختم الدعوة

  // وقت بدء العد التنازلي: YYYY-MM-DDTHH:MM:SS
  eventDate: "2026-10-14T19:00:00",

  dateLongAr: "الأربعاء، الرابع عشر من تشرين الأول 2026",
  dateLongEn: "Wednesday, October 14, 2026",

  venue: "قاعة ماريوت بالاس",
  address: "دمشق – سوريا",
  mapsUrl: "https://maps.app.goo.gl/i8PK1ZETP77RkPkf7",

  // رقم واتساب لاستلام تأكيدات الحضور، مع رمز الدولة وبدون + (مثال: 963900000000). اتركه فارغاً لتعطيله.
  whatsapp: "",

  //storyAr: "حكاية جميلة بدأت بلقاء، وكبرت بالمحبة، واليوم نحتفل ببداية فصل جديد من حياتنا معاً.",
  storyAr:"كل القصة بدأت لما شفتها أول مرة وحسيت حالي شايفها من قبل أو بعرفها من زمان , بجوز في عالم الأرواح , بجوز لأنها من نصيبي .. المهم أني دورت عليها كتير  لحتى لقيتها"
  ,storyEn: "A beautiful story began with a meeting, grew with love, and today we celebrate a new chapter together.",

  program: [
    { time: "06:00", ar: "استقبال الضيوف", en: "Guest Reception" },
    { time: "07:00", ar: "دخول العروس", en: "Bride's Entrance" },
    { time: "08:00", ar: "الاحتفال", en: "Celebration" },
    { time: "09:00", ar: "دخول العريس", en: "Groom's Entrance" },
    { time: "10:00", ar: "نهاية الحفلة", en: "End of the Evening" }
  ],

  // ضع صورك هنا: images/1.jpg ... images/6.jpg
  gallery: [
    "images/222.jpg", "images/333.jpg"
  ],

  // اسم ملف الموسيقى داخل assets. إذا لم تضعه، يبقى زر الموسيقى غير فعال.
  music: "assets/music.mp3"
};
