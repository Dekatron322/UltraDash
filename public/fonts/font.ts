import * as Font from "expo-font";

export const loadFonts = async () => {
  await Font.loadAsync({
    "ClashDisplay-Bold": require("../assets/fonts/ClashDisplay-Bold.otf"),
    "ClashDisplay-Regular": require("../assets/fonts/ClashDisplay-Regular.otf"),
    "ClashDisplay-Medium": require("../assets/fonts/ClashDisplay-Medium.otf"),
    "ClashDisplay-Semibold": require("../assets/fonts/ClashDisplay-Semibold.otf"),
  });
};

export const fontStyles = {
  bold: { fontFamily: "ClashDisplay-Bold" },
  regular: { fontFamily: "ClashDisplay-Regular" },
  medium: { fontFamily: "ClashDisplay-Medium" },
  semibold: { fontFamily: "ClashDisplay-Semibold" },
};
