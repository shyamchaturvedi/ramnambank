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
        saffron: "#FF9933",
        "deep-saffron": "#E67E22",
        "royal-gold": "#D4AF37",
        "sacred-red": "#800000",
      },
    },
  },
  plugins: [],
};
export default config;
