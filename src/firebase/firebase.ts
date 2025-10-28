// src/firebase/firebase.ts

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// ✅ 你的项目配置
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "sss-frontend-ui.firebaseapp.com",
  projectId: "sss-frontend-ui",
  storageBucket: "sss-frontend-ui.appspot.com",
  messagingSenderId: "568331976575",
  appId: "1:568331976575:web:7817eb1c886841654a644a",
  measurementId: "G-29K58PYTRR",
};

// ✅ 初始化 Firebase 应用
const app = initializeApp(firebaseConfig);

// ✅ 获取 Auth 实例
export const auth = getAuth(app);
