import { colors, typography, spacing, radii, shadows } from './src/styles/tokenValues.js';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: colors.primary,
        secondary: colors.secondary,
        neutral: colors.neutral,
        semantic: colors.semantic,
        venues: colors.venues,
      },
      backgroundImage: {
        'hero-gradient': colors.gradients.hero,
        'button-gradient': colors.gradients.button,
        'pill-gradient': colors.gradients.pill,
      },
      fontFamily: typography.fontFamily,
      fontSize: typography.fontSize,
      fontWeight: typography.fontWeight,
      lineHeight: typography.lineHeight,
      spacing,
      borderRadius: {
        lg: radii.lg,
        md: radii.md,
        sm: radii.sm,
        xl: radii.xl,
        pill: radii.pill,
      },
      boxShadow: {
        subtle: shadows.subtle,
        medium: shadows.medium,
        elevated: shadows.elevated,
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};