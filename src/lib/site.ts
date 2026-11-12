// ข้อมูลร้าน — แก้ไขที่ไฟล์นี้ไฟล์เดียว แล้วทุกหน้าจะอัปเดตตาม
// (ตอนนี้เป็นข้อมูลตัวอย่าง กรุณาเปลี่ยนเป็นข้อมูลจริงของร้าน)
export const site = {
  name: "Seabreeze Pharma",
  nameTh: "ร้านยาซีบรีซ ฟาร์มา",
  tagline: "ร้านยาใกล้ทะเล ใส่ใจสุขภาพคุณเหมือนคนในครอบครัว",
  address: "99/9 ถนนเลียบชายหาด ตำบลบางแสน อำเภอเมืองชลบุรี จังหวัดชลบุรี 20130",
  phone: "038-123-456",
  mobile: "081-234-5678",
  email: "contact@seabreezepharma.com",
  line: { id: "@seabreezepharma", url: "https://line.me/R/ti/p/@seabreezepharma" },
  facebook: { name: "Seabreeze Pharma", url: "https://www.facebook.com/seabreezepharma" },
  hours: [
    { days: "จันทร์ – เสาร์", time: "08:30 – 21:00 น." },
    { days: "อาทิตย์ และวันหยุดนักขัตฤกษ์", time: "09:00 – 18:00 น." },
  ],
  // ลิงก์ Google Maps แบบ embed (Google Maps → แชร์ → ฝังแผนที่ → คัดลอก src)
  mapEmbedUrl:
    "https://www.google.com/maps?q=Bang+Saen+Beach,+Chon+Buri&output=embed",
} as const;
