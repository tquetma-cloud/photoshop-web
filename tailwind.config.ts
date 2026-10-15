import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: { extend: { colors: { accent: { DEFAULT: "#3b82f6", hover: "#2563eb" } } } },
  plugins: [],
};
export default config;
