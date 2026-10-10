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
  fax: "021-00000000",
  foundedYear: "۱۳۸۶",
  heroTitle: "کیفیت اولویت اول کاری ماست ...",
  heroText: "تولید و تأمین انواع کالاهای مصرفی، جراحی و لوازم یکبار مصرف لاپاراسکوپی با آخرین استانداردهای جهانی از جمله استاندارد ISO 13485 و استاندارد مدیریت کیفیت.",
  catalog: "#", /* لینک فایل PDF کاتالوگ */
  instagram: "#",
  facebook: "#",
  twitter: "#",
  youtube: "#",
  pinterest: "#",
  telegram: "#",
  linkedin: "#"
};

/* bg: رنگ پس‌زمینه کارت دسته (اگر عکس assets/img/categories/<id>.jpg نباشد) */
window.CATEGORIES = [
  { id: "laparoscopy", title: "لوازم یکبار مصرف لاپاراسکوپی", icon: "grasper", bg: "radial-gradient(circle at 50% 45%,#9a9a9a,#3f4245)" },
  { id: "vessel", title: "هندپیس انسداد عروق", icon: "scalpel", bg: "radial-gradient(circle at 50% 40%,#43b4d6,#075f86)" },
  { id: "stapler", title: "استپلر جراحی", icon: "stapler", bg: "radial-gradient(circle at 50% 40%,#2fb7a0,#0b6e62)",
    children: [ { id: "stapler-surgical", title: "استپلر داخلی و کارتریج" }, { id: "stapler-skin", title: "استپلر پوستی" } ] },
  { id: "electrocautery", title: "لوازم جانبی الکتروکوتر جراحی", icon: "pencil", bg: "linear-gradient(180deg,#5fd6ea,#0a5fb8)" },
  { id: "clips", title: "کلیپس‌های پلیمری", icon: "clip", bg: "radial-gradient(circle at 50% 50%,#d7ecf7,#6aa7c8)" },
  { id: "trocar", title: "تروکار", icon: "trocar", bg: "radial-gradient(circle at 50% 50%,#2b74d8,#06142f)" },
  { id: "mesh", title: "مش و تکر مش جراحی", icon: "mesh", bg: "linear-gradient(160deg,#ffd84d,#ff8a3d)" },
  { id: "monitoring", title: "لوازم جانبی مانیتورینگ", icon: "ecg", bg: "linear-gradient(160deg,#ff3d3d,#ff9a5a)" },
  { id: "endoscopy", title: "لوازم یکبار مصرف آندوسکوپی", icon: "endo", bg: "linear-gradient(135deg,#7b5cff,#55d3e6)" }
];

window.BRANDS = [
  { id: "own", title: "برند اختصاصی", en: "YOUR BRAND", style: "font-weight:900;letter-spacing:3px;color:#1d8f3f" },
  { id: "kaydee", title: "کی دی", en: "Kaydee", style: "font-family:'Brush Script MT',cursive;font-size:30px;color:#111" },
  { id: "transeasy", title: "ترنس ایزی", en: "Transeasy", style: "color:#1b75bb;font-weight:700" },
  { id: "maicuff", title: "مای کاف", en: "maicuff", style: "color:#222;font-weight:800;border-top:12px solid #d71f26;padding-top:2px" },
  { id: "efmedica", title: "ای اف مدیکا", en: "EF MEDICA", style: "color:#1b4fa0;font-style:italic;font-weight:900" },
  { id: "panther", title: "پنتر", en: "Panther", style: "color:#fff;background:#1b4fa0;padding:0 8px;font-style:italic;font-weight:800" },
  { id: "mindray", title: "میندری", en: "mindray", style: "color:#d71f26;font-weight:800" },
  { id: "vedkang", title: "ودکنگ", en: "Vedkang", style: "color:#c1272d;font-weight:900" }
];
