// ข้อมูลร้าน — แก้ไขที่ไฟล์นี้ไฟล์เดียว แล้วทุกหน้าจะอัปเดตตาม
// (ตอนนี้เป็นข้อมูลตัวอย่าง กรุณาเปลี่ยนเป็นข้อมูลจริงของร้าน)
export const site = {
  name: "Seabreeze Pharma",
  nameTh: "ร้านยาซีบรีซ ฟาร์มา",
  tagline: "ร้านยาใกล้ทะเล ใส่ใจสุขภาพคุณเหมือนคนในครอบครัว",
  address: "81/1 หมู่1 ตำบลแม่น้ำ อำเภอเกาะสมุย จังหวัดสุราษฏธานี 84330",
  phone: "077-963-198",
  mobile: "085-905-5881",
  email: "seabreeze.pharma@gmail.com",
  line: { id: "@seabreezepharma", url: "https://line.me/R/ti/p/@seabreezepharma" },
  facebook: { name: "Seabreeze Pharma", url: "https://www.facebook.com/seabreezepharma" },
  hours: [
    { days: "จันทร์ – อาทิตย์", time: "08:00 – 21:00 น." },
  ],
  // ลิงก์ Google Maps แบบ embed (Google Maps → แชร์ → ฝังแผนที่ → คัดลอก src)
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3739.65086316193!2d99.99888519999999!3d9.567864799999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3054f0ae257ec9d5%3A0xb7756ef3a0a88901!2sSeabreeze%20pharma!5e1!3m2!1sth!2sth!4v1794472368363!5m2!1sth!2sth",
} as const;
