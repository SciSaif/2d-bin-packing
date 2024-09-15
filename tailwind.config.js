/** @type {import('tailwindcss').Config} */
import colors from "tailwindcss/colors";
import flattenColorPalette from "tailwindcss/lib/util/flattenColorPalette";
import svgToDataUri from "mini-svg-data-uri";
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                // Original palette
                bg: { ...colors.neutral, DEFAULT: colors.neutral[100] },
                primary: { ...colors.yellow, DEFAULT: colors.yellow[400] },
                secondary: { ...colors.teal, DEFAULT: colors.teal[900] },
                tertiary: { ...colors.zinc, DEFAULT: colors.zinc[700] },

                // Alternative Palette 1: Cool and Calm
                // bg: { ...colors.slate, DEFAULT: colors.slate[100] },
                // primary: { ...colors.sky, DEFAULT: colors.sky[400] },
                // secondary: { ...colors.indigo, DEFAULT: colors.indigo[700] },
                // tertiary: { ...colors.gray, DEFAULT: colors.gray[600] },

                // // Alternative Palette 2: Warm and Earthy
                // bg: { ...colors.stone, DEFAULT: colors.stone[100] },
                // primary: { ...colors.amber, DEFAULT: colors.amber[500] },
                // secondary: { ...colors.emerald, DEFAULT: colors.emerald[700] },
                // tertiary: { ...colors.brown, DEFAULT: colors.orange[700] },

                // Alternative Palette 3
                // bg: { ...colors.stone, DEFAULT: colors.yellow[50] },
                // primary: { ...colors.amber, DEFAULT: colors.amber[700] },
                // primaryLight: { ...colors.amber, DEFAULT: colors.orange[300] },
                // secondary: { ...colors.emerald, DEFAULT: colors.stone[800] },
                // secondaryLight: {
                //     ...colors.emerald,
                //     DEFAULT: colors.stone[600],
                // },
                // tertiary: { ...colors.brown, DEFAULT: colors.orange[700] },
            },
        },
    },
    plugins: [
        addVariablesForColors,
        function ({ matchUtilities, theme }) {
            matchUtilities(
                {
                    "bg-grid": (value) => ({
                        backgroundImage: `url("${svgToDataUri(
                            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
                        )}")`,
                    }),
                    "bg-grid-small": (value) => ({
                        backgroundImage: `url("${svgToDataUri(
                            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="8" height="8" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
                        )}")`,
                    }),
                    "bg-dot": (value) => ({
                        backgroundImage: `url("${svgToDataUri(
                            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="1.6257413380501518"></circle></svg>`
                        )}")`,
                    }),
                },
                {
                    values: flattenColorPalette(theme("backgroundColor")),
                    type: "color",
                }
            );
        },
    ],
};

function addVariablesForColors({ addBase, theme }) {
    let allColors = flattenColorPalette(theme("colors"));
    let newVars = Object.fromEntries(
        Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
    );

    addBase({
        ":root": newVars,
    });
}
