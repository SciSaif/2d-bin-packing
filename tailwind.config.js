/** @type {import('tailwindcss').Config} */
import colors from "tailwindcss/colors";

export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                bg: { ...colors.neutral, DEFAULT: colors.neutral[100] },
                primary: { ...colors.yellow, DEFAULT: colors.yellow[400] },
                secondary: { ...colors.teal, DEFAULT: colors.teal[900] },
                tertiary: { ...colors.zinc, DEFAULT: colors.zinc[700] },
            },
        },
    },
    plugins: [],
};
