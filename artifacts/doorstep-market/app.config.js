import appJson from "./app.json";

export default {
  expo: {
    ...appJson.expo,
    extra: {
      ...appJson.expo.extra,
      router: {
        ...appJson.expo.extra?.router,
        origin: process.env.EXPO_PUBLIC_DOMAIN,
      },
    },
  },
};
