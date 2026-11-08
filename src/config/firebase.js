// ⚠️ أضف بيانات Firebase الخاصة بك هنا
// 1. اذهب إلى https://console.firebase.google.com
// 2. أنشئ مشروعاً جديداً
// 3. أضف تطبيق Android بـ package: com.kidguard.app
// 4. انسخ بيانات الإعداد هنا

import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export default app;
