# 📱 KidGuard - تطبيق رقابة الوالدين

تطبيق React Native (Expo) لمراقبة أطفالك بشكل آمن وشفاف.

---

## 🚀 خطوات التثبيت وبناء APK

### 1. تثبيت المتطلبات
```bash
# تثبيت Node.js من https://nodejs.org
# ثم:
npm install -g expo-cli eas-cli
```

### 2. تثبيت المكتبات
```bash
cd kidguard
npm install
```

### 3. إعداد Firebase (مجاني)
- اذهب إلى https://console.firebase.google.com
- أنشئ مشروع جديد
- أضف تطبيق Android بـ package: `com.kidguard.app`
- انسخ بيانات الإعداد في `src/config/firebase.js`

### 4. تشغيل على جهازك مباشرة (بدون بناء)
```bash
npx expo start
# امسح QR Code بتطبيق Expo Go
```

### 5. بناء APK جاهز للتثبيت
```bash
# إنشاء حساب على https://expo.dev
eas login
eas build --platform android --profile preview
# بعد 10-15 دقيقة يرسل لك رابط APK
```

---

## 📂 هيكل المشروع
```
kidguard/
├── App.js                    # نقطة البداية
├── app.json                  # إعدادات Expo
├── eas.json                  # إعدادات البناء
├── src/
│   ├── i18n/translations.js  # العربية والفرنسية
│   ├── theme/index.js        # الألوان والتصميم
│   ├── navigation/           # التنقل بين الشاشات
│   ├── screens/
│   │   ├── HomeScreen.js     # الرئيسية - قائمة الأطفال
│   │   ├── LocationScreen.js # الموقع + الخريطة
│   │   ├── MediaScreen.js    # الصور
│   │   ├── AppsScreen.js     # التطبيقات + الحظر
│   │   └── SettingsScreen.js # الإعدادات
│   └── components/           # مكونات مشتركة
└── assets/                   # الأيقونات والصور
```

---

## ✅ الميزات المتاحة
- 📍 تتبع الموقع الحقيقي (expo-location)
- 🖼 عرض صور الهاتف (expo-media-library)
- 📲 قائمة التطبيقات مع خيار الحظر
- 🔔 إشعارات التنبيه
- 🌐 دعم العربية والفرنسية
- 🏠 مناطق آمنة (المنزل، المدرسة)

## ⚠️ ملاحظة مهمة
هذا التطبيق شفاف - الطفل يعرف بوجوده.
احترام خصوصية أطفالك بالتواصل المفتوح أهم من المراقبة المخفية.
