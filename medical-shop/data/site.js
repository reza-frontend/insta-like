/* تنظیمات کلی فروشگاه — فقط این فایل را برای تغییر نام، تلفن و ... ویرایش کنید */
window.SITE = {
  name: "طب تجهیز",
  nameEn: "TEB TAJHIZ",
  slogan: "تأمین‌کننده لوازم مصرفی و یکبارمصرف پزشکی و جراحی",
  phone: "021-00000000",
  phoneRaw: "+982100000000",
  mobile: "0912-000-0000",
  whatsapp: "989120000000",
  email: "info@example.com",
  hours: "شنبه تا پنجشنبه، ۹ تا ۱۹",
  address: "تهران، ... (آدرس فروشگاه شما)",
  instagram: "#",
  telegram: "#",
  linkedin: "#"
};

window.CATEGORIES = [
  { id: "laparoscopy", title: "تجهیزات لاپاراسکوپی", icon: "trocar",
    children: [
      { id: "lap-disposable", title: "لوازم یکبار مصرف لاپاراسکوپی" },
      { id: "lap-permanent", title: "لوازم دائمی لاپاراسکوپی" }
    ] },
  { id: "stapler", title: "استپلر جراحی", icon: "stapler",
    children: [
      { id: "stapler-surgical", title: "استپلرهای جراحی داخلی" },
      { id: "stapler-skin", title: "استپلر پوستی" }
    ] },
  { id: "mesh", title: "مش جراحی", icon: "mesh" },
  { id: "electrocautery", title: "لوازم جانبی الکتروکوتر", icon: "pencil" },
  { id: "monitoring", title: "لوازم جانبی علائم حیاتی و ECG", icon: "ecg" },
  { id: "endoscopy", title: "لوازم یکبار مصرف آندوسکوپی", icon: "endo" },
  { id: "covers", title: "کاورهای استریل", icon: "cover" },
  { id: "clips", title: "کلیپ‌های پلیمری عروقی", icon: "clip" }
];

window.BRANDS = [
  { id: "own", title: "برند اختصاصی", en: "House Brand" },
  { id: "mindray", title: "میندری", en: "Mindray" },
  { id: "panther", title: "پنتر", en: "Panther" },
  { id: "kaydee", title: "کی دی", en: "Kaydee" },
  { id: "transeasy", title: "ترنس ایزی", en: "Transeasy" },
  { id: "hocermed", title: "هوسر مد", en: "Hocermed" }
];
