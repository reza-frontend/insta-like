/* داده محصولات — قیمت به تومان؛ price: 0 یعنی «استعلام قیمت»
   عکس: فایل assets/img/products/<slug>.jpg را بگذارید (یا image: "مسیر/لینک") */
window.PRODUCTS = [
  {"id":1,"slug":"trocar-5","title":"تروکار یکبار مصرف","en":"Disposable Trocar 5mm","cat":"trocar","parent":"trocar","brand":"own","icon":"trocar","price":0,"oldPrice":0,"stock":true,"short":"تروکار یکبار مصرف با تیغه محافظ‌دار و کانولای شفاف، مناسب جراحی‌های لاپاراسکوپی عمومی، زنان و اورولوژی.","specs":{"قطر":"۵ میلی‌متر","طول کانولا":"۱۰۰ میلی‌متر","نوع نوک":"تیغه‌دار با شیلد ایمنی","استریل":"EO","استاندارد":"ISO 13485 / CE"},"rating":5},
  {"id":2,"slug":"trocar-10","title":"تروکار یکبار مصرف ۱۰ میلی‌متر","en":"Disposable Trocar 10mm","cat":"trocar","parent":"trocar","brand":"own","icon":"trocar","price":0,"stock":true,"short":"تروکار ۱۰ میلی‌متری با سیل دوطرفه جهت جلوگیری از نشت گاز و امکان تعویض ابزار بدون ریداکشن.","specs":{"قطر":"۱۰ میلی‌متر","طول کانولا":"۱۰۰ میلی‌متر","سیل":"دوطرفه یونیورسال","استریل":"EO","استاندارد":"ISO 13485 / CE"},"rating":5},
  {"id":3,"slug":"trocar-12","title":"تروکار یکبار مصرف ۱۲ میلی‌متر","en":"Disposable Trocar 12mm","cat":"trocar","parent":"trocar","brand":"own","icon":"trocar","price":0,"stock":true,"short":"تروکار ۱۲ میلی‌متری مناسب عبور استپلر خطی برشی و کیسه‌های خروج نمونه.","specs":{"قطر":"۱۲ میلی‌متر","طول کانولا":"۱۰۰ میلی‌متر","نوع نوک":"بدون تیغه (Bladeless)","استریل":"EO"},"rating":4},
  {"id":4,"slug":"veress-needle","title":"سوزن ورس یکبار مصرف","en":"Veress Needle","cat":"trocar","parent":"trocar","brand":"own","icon":"needle","price":0,"stock":true,"short":"سوزن ورس فنردار جهت ایجاد پنوموپریتوئن ایمن در شروع جراحی لاپاراسکوپی.","specs":{"طول":"۱۲۰ / ۱۵۰ میلی‌متر","قطر":"۲ میلی‌متر","نشانگر":"رنگی فنردار","استریل":"EO"},"rating":4},
  {"id":5,"slug":"johan-grasper","title":"گراسپر جوهان یکبار مصرف لاپاراسکوپی","en":"Disposable Laparoscopic Johan Grasper","cat":"laparoscopy","parent":"laparoscopy","brand":"own","icon":"grasper","price":0,"stock":true,"short":"گراسپر آتروماتیک جوهان با دسته ارگونومیک و قابلیت چرخش ۳۶۰ درجه، دارای اتصال مونوپلار.","specs":{"قطر شفت":"۵ میلی‌متر","طول کاری":"۳۳۰ میلی‌متر","چرخش":"۳۶۰ درجه","اتصال":"مونوپلار"},"rating":4},
  {"id":6,"slug":"maryland-dissector","title":"دایسکتور مریلند یکبار مصرف","en":"Disposable Maryland Dissector","cat":"laparoscopy","parent":"laparoscopy","brand":"own","icon":"grasper","price":0,"stock":true,"short":"دایسکتور مریلند با فک خمیده جهت دیسکشن دقیق بافت در جراحی‌های لاپاراسکوپی.","specs":{"قطر شفت":"۵ میلی‌متر","طول کاری":"۳۳۰ میلی‌متر","فک":"خمیده دوطرفه","اتصال":"مونوپلار"},"rating":4},
  {"id":7,"slug":"lap-scissors","title":"قیچی متزنبام لاپاراسکوپی یکبار مصرف","en":"Disposable Metzenbaum Scissors","cat":"laparoscopy","parent":"laparoscopy","brand":"own","icon":"scissors","price":0,"stock":true,"short":"قیچی خمیده متزنبام با تیغه‌های تیز و اتصال کوتر، مناسب برش و دیسکشن.","specs":{"قطر شفت":"۵ میلی‌متر","طول کاری":"۳۳۰ میلی‌متر","تیغه":"خمیده","اتصال":"مونوپلار"},"rating":4},
  {"id":8,"slug":"suction-irrigation","title":"ست ساکشن ایریگیشن لاپاراسکوپی","en":"Suction Irrigation Set","cat":"laparoscopy","parent":"laparoscopy","brand":"own","icon":"suction","price":0,"stock":true,"short":"ست ساکشن و شستشوی یکبار مصرف با دکمه‌های تفکیک‌شده و لوله‌های بلند.","specs":{"قطر کانولا":"۵ میلی‌متر","طول":"۳۳۰ میلی‌متر","طول لوله":"۳ متر","استریل":"EO"},"rating":4},
  {"id":9,"slug":"specimen-bag","title":"کیسه خروج نمونه (اندوبگ)","en":"Specimen Retrieval Bag","cat":"laparoscopy","parent":"laparoscopy","brand":"own","icon":"bag","price":0,"stock":true,"short":"کیسه خروج نمونه با مکانیزم باز شدن خودکار، مقاوم در برابر پارگی.","specs":{"حجم":"۱۰۰ / ۲۰۰ میلی‌لیتر","قطر ورود":"۱۰ میلی‌متر","جنس":"پلی‌یورتان"},"rating":4},
  {"id":10,"slug":"babcock-grasper","title":"گرسپر بیکاک لاپاراسکوپی","en":"Laparoscopic Babcock Grasper","cat":"laparoscopy","parent":"laparoscopy","brand":"own","icon":"grasper","price":0,"stock":true,"short":"گرسپر بیکاک یکبار مصرف با فک پنجره‌دار آتروماتیک جهت گرفتن ایمن بافت‌های ظریف مانند روده و لوله رحمی.","specs":{"قطر شفت":"۵ میلی‌متر","طول کاری":"۳۳۰ میلی‌متر","چرخش":"۳۶۰ درجه","فک":"بیکاک پنجره‌دار"},"rating":4},
  {"id":11,"slug":"vessel-sealing-handpiece","title":"هندپیس انسداد عروق","en":"Vessel Sealing Handpiece","cat":"vessel","parent":"vessel","brand":"own","icon":"scalpel","price":0,"stock":true,"short":"هندپیس اولتراسونیک جهت برش و انسداد هم‌زمان عروق تا ۵ میلی‌متر با حداقل آسیب حرارتی.","specs":{"طول شفت":"۲۳ / ۳۶ / ۴۵ سانتی‌متر","قطر":"۵ میلی‌متر","انسداد عروق":"تا ۵ میلی‌متر","سازگاری":"ژنراتور اولتراسونیک"},"rating":5},
  {"id":12,"slug":"clip-applier","title":"کلیپ پلیمری عروقی (Hem-lock)","en":"Polymer Ligating Clip","cat":"clips","parent":"clips","brand":"own","icon":"clip","price":0,"stock":true,"short":"کلیپ پلیمری غیرقابل جذب با قفل ایمن جهت بستن عروق و مجاری.","specs":{"سایزها":"M / ML / L / XL","تعداد در کارتریج":"۶ عدد","جنس":"پلیمر غیرقابل جذب"},"rating":4},
  {"id":13,"slug":"linear-cutter-stapler","title":"استپلر خطی برشی لاپاراسکوپی","en":"Disposable Linear Cutter Stapler","cat":"stapler-surgical","parent":"stapler","brand":"own","icon":"stapler","price":0,"stock":true,"short":"استپلر اندوسکوپیک خطی برشی با قابلیت آرتیکولاسیون، مناسب جراحی‌های چاقی، ریه و کولورکتال.","specs":{"طول خط":"۴۵ / ۶۰ میلی‌متر","آرتیکولاسیون":"۴۵ درجه","رنگ کارتریج":"سفید / آبی / طلایی / سبز","شفت":"۱۲ میلی‌متر"},"rating":5},
  {"id":14,"slug":"stapler-cartridge","title":"کارتریج استپلر خطی برشی","en":"Linear Cutter Reload","cat":"stapler-surgical","parent":"stapler","brand":"own","icon":"cartridge","price":0,"stock":true,"short":"کارتریج یدک استپلر خطی برشی در ارتفاع‌های مختلف منگنه برای انواع بافت.","specs":{"طول":"۴۵ / ۶۰ میلی‌متر","ارتفاع منگنه":"۲.۰ تا ۴.۸ میلی‌متر","ردیف منگنه":"۶ ردیف"},"rating":4},
  {"id":15,"slug":"circular-stapler","title":"استپلر حلقوی (سیرکولار)","en":"Disposable Circular Stapler","cat":"stapler-surgical","parent":"stapler","brand":"own","icon":"circular","price":0,"stock":true,"short":"استپلر حلقوی جهت آناستوموز دستگاه گوارش با سر قابل جدا شدن.","specs":{"قطر":"۲۱ / ۲۵ / ۲۸ / ۳۱ / ۳۳ میلی‌متر","ارتفاع منگنه":"قابل تنظیم","جنس منگنه":"تیتانیوم"},"rating":4},
  {"id":16,"slug":"hemorrhoidal-stapler","title":"استپلر هموروئید","en":"Disposable Hemorrhoidal Circular Stapler","cat":"stapler-surgical","parent":"stapler","brand":"own","icon":"circular","price":0,"stock":true,"short":"ست کامل استپلر هموروئید (PPH) شامل آنوسکوپ، دیلاتور و سوزن نخ.","specs":{"قطر":"۳۳ میلی‌متر","محتویات ست":"استپلر، آنوسکوپ، دیلاتور، نخ‌گیر","جنس منگنه":"تیتانیوم"},"rating":4},
  {"id":17,"slug":"skin-stapler","title":"استپلر پوستی ۳۵ منگنه","en":"Disposable Skin Stapler 35W","cat":"stapler-skin","parent":"stapler","brand":"own","icon":"skin","price":0,"stock":true,"short":"استپلر پوستی یکبار مصرف با منگنه پهن جهت بستن سریع و زیبای زخم.","specs":{"تعداد منگنه":"۳۵ عدد","عرض منگنه":"۶.۹ میلی‌متر","جنس":"استیل ضدزنگ","استریل":"EO"},"rating":5},
  {"id":18,"slug":"staple-remover","title":"منگنه کش پوستی","en":"Skin Staple Remover","cat":"stapler-skin","parent":"stapler","brand":"own","icon":"skin","price":0,"stock":true,"short":"منگنه‌کش استریل یکبار مصرف جهت خارج کردن آسان منگنه‌های پوستی.","specs":{"جنس":"استیل / پلاستیک","استریل":"EO","بسته‌بندی":"تکی"},"rating":4},
  {"id":19,"slug":"polypropylene-mesh","title":"مش جراحی پلی‌پروپیلن","en":"Polypropylene Surgical Mesh","cat":"mesh","parent":"mesh","brand":"own","icon":"mesh","price":0,"stock":true,"short":"مش پلی‌پروپیلن مونوفیلامان جهت ترمیم انواع فتق اینگوینال، شکمی و انسیزیونال.","specs":{"سایزها":"۶×۱۱، ۷.۶×۱۵، ۱۵×۱۵، ۳۰×۳۰ سانتی‌متر","ساختار":"مونوفیلامان، ماکروپور","استریل":"EO"},"rating":5},
  {"id":20,"slug":"electrosurgical-pencil","title":"قلم کوتر یکبار مصرف","en":"Electro Surgical Pencil","cat":"electrocautery","parent":"electrocautery","brand":"own","icon":"pencil","price":0,"stock":true,"short":"قلم کوتر دکمه‌ای با دو حالت Cut و Coag و کابل ۳ متری، سازگار با اغلب دستگاه‌های الکتروکوتر.","specs":{"کنترل":"دکمه‌ای (Cut / Coag)","طول کابل":"۳ متر","نوک":"تیغه‌ای","استریل":"EO"},"rating":4},
  {"id":21,"slug":"patient-plate","title":"پلیت بیمار (پد کوتر) یکبار مصرف","en":"Patient Return Electrode","cat":"electrocautery","parent":"electrocautery","brand":"own","icon":"plate","price":0,"stock":true,"short":"پد برگشتی دوقطبی با ژل رسانا و چسبندگی مطمئن، سازگار با سیستم REM.","specs":{"نوع":"Split (دوتکه)","سایز":"بزرگسال / اطفال","چسب":"ژل هیدروژل"},"rating":4},
  {"id":22,"slug":"ecg-electrode","title":"الکترود ECG بزرگسال","en":"ECG Electrode Adult","cat":"monitoring","parent":"monitoring","brand":"kaydee","icon":"ecg","price":0,"stock":true,"short":"الکترود فومی با ژل جامد و سنسور Ag/AgCl جهت مانیتورینگ قلبی.","specs":{"سنسور":"Ag/AgCl","پشت":"فوم","بسته‌بندی":"۵۰ عددی"},"rating":4},
  {"id":23,"slug":"spo2-sensor","title":"پراب پالس اکسیمتری (SpO2) میندری","en":"Mindray SpO2 Sensor","cat":"monitoring","parent":"monitoring","brand":"mindray","icon":"spo2","price":0,"stock":true,"short":"سنسور انگشتی SpO2 سازگار با مانیتورهای میندری، کابل مقاوم.","specs":{"نوع":"انگشتی بزرگسال","طول کابل":"۳ متر","سازگاری":"Mindray"},"rating":4},
  {"id":24,"slug":"nibp-cuff","title":"کاف فشار خون (NIBP) مانیتور","en":"NIBP Cuff","cat":"monitoring","parent":"monitoring","brand":"transeasy","icon":"cuff","price":0,"stock":true,"short":"کاف فشار خون قابل شستشو در سایزهای نوزاد تا بزرگسال، تک‌لوله و دولوله.","specs":{"سایزها":"نوزاد / اطفال / بزرگسال / ران","لوله":"تک‌لوله / دولوله","جنس":"نایلون"},"rating":4},
  {"id":25,"slug":"ibp-transducer","title":"ترانسدیوسر فشار تهاجمی (IBP)","en":"IBP Transducer","cat":"monitoring","parent":"monitoring","brand":"transeasy","icon":"ecg","price":0,"stock":true,"short":"ست ترانسدیوسر فشار خون تهاجمی یکبار مصرف با فلاش پیوسته.","specs":{"کانال":"تک / دو کانال","فلاش":"۳ میلی‌لیتر در ساعت","استریل":"EO"},"rating":4},
  {"id":26,"slug":"biopsy-forceps","title":"فورسپس بیوپسی آندوسکوپی","en":"Disposable Biopsy Forceps","cat":"endoscopy","parent":"endoscopy","brand":"hocermed","icon":"endo","price":0,"stock":true,"short":"فورسپس بیوپسی یکبار مصرف با فک بیضی، با یا بدون سوزن، مناسب گاستروسکوپی و کولونوسکوپی.","specs":{"قطر":"۲.۳ میلی‌متر","طول":"۱۶۰۰ / ۲۳۰۰ میلی‌متر","فک":"بیضی با سوزن"},"rating":4},
  {"id":27,"slug":"polypectomy-snare","title":"اسنیر پولیپکتومی","en":"Polypectomy Snare","cat":"endoscopy","parent":"endoscopy","brand":"hocermed","icon":"endo","price":0,"stock":true,"short":"اسنیر یکبار مصرف بیضی/شش‌ضلعی جهت برداشتن پولیپ در کولونوسکوپی.","specs":{"قطر حلقه":"۱۰ تا ۳۰ میلی‌متر","شکل":"بیضی / شش‌ضلعی","طول":"۲۳۰۰ میلی‌متر"},"rating":4},
  {"id":28,"slug":"injection-needle","title":"سوزن اسکلروتراپی آندوسکوپی","en":"Endoscopic Injection Needle","cat":"endoscopy","parent":"endoscopy","brand":"panther","icon":"needle","price":0,"stock":true,"short":"سوزن تزریق آندوسکوپیک جهت هموستاز و اسکلروتراپی.","specs":{"سایز سوزن":"۲۳G / ۲۵G","طول سوزن":"۴ / ۵ میلی‌متر","طول کاتتر":"۱۸۰۰ میلی‌متر"},"rating":4},
  {"id":29,"slug":"camera-cover","title":"کاور دوربین لاپاراسکوپی","en":"Camera Cover","cat":"laparoscopy","parent":"laparoscopy","brand":"own","icon":"cover","price":0,"stock":true,"short":"کاور استریل پلی‌اتیلن برای دوربین و کابل نوری با نوار چسب ثابت‌کننده.","specs":{"ابعاد":"۱۶ × ۲۵۰ سانتی‌متر","جنس":"پلی‌اتیلن شفاف","استریل":"EO"},"rating":4},
  {"id":30,"slug":"microscope-cover","title":"کاور میکروسکوپ جراحی","en":"Microscope Drape","cat":"laparoscopy","parent":"laparoscopy","brand":"panther","icon":"cover","price":0,"stock":false,"short":"درپ استریل میکروسکوپ با لنز محافظ شفاف جهت حفظ دید کامل.","specs":{"ابعاد":"۱۲۰ × ۲۸۰ سانتی‌متر","لنز":"۶۵ میلی‌متر","استریل":"EO"},"rating":4},
  {"id":31,"slug":"smart-stapler","title":"استپلر اسمارت","en":"Smart Endo Stapler","cat":"stapler-surgical","parent":"stapler","brand":"own","icon":"stapler","price":0,"stock":true,"rating":4,"short":"استپلر اندوسکوپیک هوشمند با دسته ارگونومیک و آرتیکولاسیون چندمرحله‌ای، سازگار با کارتریج‌های Articular.","specs":{"طول خط":"۶۰ میلی‌متر","آرتیکولاسیون":"۴۵ درجه دوطرفه","شفت":"۱۲ میلی‌متر","سازگاری":"کارتریج Articular"}},
  {"id":32,"slug":"articular-cartridge","title":"کارتریج استپلر Articular","en":"Articular Stapler Cartridge","cat":"stapler-surgical","parent":"stapler","brand":"own","icon":"cartridge","price":0,"stock":true,"rating":5,"short":"کارتریج مفصل‌دار استپلر اندوسکوپیک در رنگ‌ها و ارتفاع منگنه‌های مختلف.","specs":{"طول":"۴۵ / ۶۰ میلی‌متر","ارتفاع منگنه":"۲.۰ تا ۴.۸ میلی‌متر","رنگ":"سفید / آبی / طلایی / سبز / مشکی"}},
  {"id":33,"slug":"mesh-tacker","title":"تکر مش جراحی","en":"Hernia Mesh Tacker","cat":"mesh","parent":"mesh","brand":"own","icon":"skin","price":0,"stock":true,"rating":4,"short":"تکر لاپاراسکوپیک جهت فیکس کردن مش در ترمیم فتق، با ۳۰ تک تیتانیومی.","specs":{"تعداد تک":"۳۰ عدد","جنس تک":"تیتانیوم","قطر شفت":"۵ میلی‌متر"}}
];

/* شناسه محصولات بخش‌های صفحه اصلی */
window.HOME = {"newest":[31,17,15,32,16,20,4,9],"best":[10,1,11,13,19,17,2,12]};

window.POSTS = [
 {
  "id": 1,
  "title": "انواع تروکار و کاربرد هر کدام در لاپاراسکوپی",
  "date": "۱۴۰۵/۰۷/۰۲",
  "cat": "لاپاراسکوپی",
  "icon": "trocar",
  "excerpt": "تروکار دریچه ورود ابزار به حفره شکم است. در این مقاله انواع تیغه‌دار، بدون تیغه و هسون را بررسی می‌کنیم."
 },
 {
  "id": 2,
  "title": "بررسی انواع سوزن ورس، ویژگی و قیمت",
  "date": "۱۴۰۵/۰۶/۲۱",
  "cat": "لاپاراسکوپی",
  "icon": "needle",
  "excerpt": "سوزن ورس اولین ابزار ورود به شکم در اغلب جراحی‌های لاپاراسکوپی است؛ نکات انتخاب و ایمنی آن را بخوانید."
 },
 {
  "id": 3,
  "title": "مش جراحی چیست و چگونه انتخاب کنیم؟",
  "date": "۱۴۰۵/۰۶/۰۸",
  "cat": "جراحی عمومی",
  "icon": "mesh",
  "excerpt": "از مش پلی‌پروپیلن سبک تا سنگین؛ تفاوت‌ها، کاربردها و عوامل مؤثر بر قیمت مش‌های جراحی."
 },
 {
  "id": 4,
  "title": "استپلر خطی برشی؛ راهنمای رنگ کارتریج‌ها",
  "date": "۱۴۰۵/۰۵/۲۷",
  "cat": "استپلر",
  "icon": "stapler",
  "excerpt": "رنگ هر کارتریج نشان‌دهنده ارتفاع منگنه و نوع بافت مناسب آن است. جدول کامل را اینجا ببینید."
 }
];

window.FAQ = [
 {
  "q": "آیا امکان ارسال به سراسر کشور وجود دارد؟",
  "a": "بله، سفارش‌ها به تمام نقاط کشور ارسال می‌شوند و معمولاً ظرف ۲ تا ۳ روز کاری تحویل داده می‌شوند."
 },
 {
  "q": "چطور از قیمت روز محصولات مطلع شوم؟",
  "a": "به دلیل نوسان بازار، قیمت اغلب اقلام از طریق تماس تلفنی یا ثبت درخواست استعلام در سبد خرید اعلام می‌شود."
 },
 {
  "q": "آیا امکان مرجوع کردن کالا وجود دارد؟",
  "a": "بله، در صورتی که محصول معیوب باشد امکان مرجوع کردن و تعویض آن وجود دارد."
 },
 {
  "q": "آیا محصولات دارای استاندارد و مجوز هستند؟",
  "a": "تمامی محصولات دارای مجوز اداره کل تجهیزات پزشکی (IRC) و استانداردهای ISO 13485 و CE هستند."
 },
 {
  "q": "آیا برای بیمارستان‌ها و مراکز درمانی فروش عمده دارید؟",
  "a": "بله، برای بیمارستان‌ها، کلینیک‌ها و توزیع‌کنندگان شرایط ویژه فروش عمده و پیش‌فاکتور رسمی ارائه می‌شود."
 }
];
