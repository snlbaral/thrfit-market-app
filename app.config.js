import "dotenv/config";

export default {
  expo: {
    name: "Hamro Closet",
    slug: "HamroCloset",
    version: "1.0.0",
    runtimeVersion: "exposdk:45.0.0",
    // runtimeVersion: "0.0.1",
    orientation: "portrait",
    icon: "./assets/icon.png",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      buildNumber: "5",
      bundleIdentifier: "com.thriftmarket.HamroCloset",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.thriftmarket.HamroCloset",
      versionCode: 1.0,
    },
    web: {
      favicon: "./assets/favicon.png",
      build: {
        babel: {
          include: ["rn-all-nepal-payment"],
        },
      },
    },
    extra: {
      eas: {
        projectId: "8673e797-0b02-49f9-acf1-e2ec5f22fd8c",
      },
      KHALTI_SECRET: process.env.KHALTI_SECRET,
      ESEWA_SECRET: process.env.ESEWA_SECRET,
      API_URL: process.env.API_URL,
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
      NCM_API: process.env.NCM_API,
      NCM_HEADER: process.env.NCM_HEADER,
    },
  },
};
