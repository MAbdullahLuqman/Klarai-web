import localFont from "next/font/local";

const manrope = localFont({ src: "../app/fonts/Manrope.ttf", weight: "200 800", display: "swap", variable: "--home-sans" });
const instrument = localFont({ src: "../app/fonts/InstrumentSerif-Italic.ttf", weight: "400", style: "italic", display: "swap", variable: "--home-serif" });
export const homepageFonts = `${manrope.variable} ${instrument.variable}`;
