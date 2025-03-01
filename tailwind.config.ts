import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
       "primary": {
        100: "#f9f9f9",
        200: "#F9FAFB",
        400: "#1E7BFF",
        500: "#2078FF",
        600: "#006DFF",
       },
       weza: {
        500: "#4f2db0",
        600: "#5b39c3"
       },
       light: {
        100: "#f9fafc",
        200: "#f9f9fb",
        300: "#f8f8fa",
        400: "#F9FAFB"
      }, 
      },
    },
  },
  plugins: [],
};
export default config;
