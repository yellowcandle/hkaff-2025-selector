/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		fontSize: {
  			'4xl': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
  			'3xl': ['2rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
  			'2xl': ['1.5rem', { lineHeight: '1.4' }],
  			'xl': ['1.25rem', { lineHeight: '1.4' }],
  		},
  		fontFamily: {
  			sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Noto Sans TC', 'sans-serif'],
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			category: {
  				drama: 'hsl(var(--category-drama))',
  				comedy: 'hsl(var(--category-comedy))',
  				documentary: 'hsl(var(--category-documentary))',
  				animation: 'hsl(var(--category-animation))',
  				action: 'hsl(var(--category-action))',
  				romance: 'hsl(var(--category-romance))',
  				thriller: 'hsl(var(--category-thriller))',
  				horror: 'hsl(var(--category-horror))',
  				scifi: 'hsl(var(--category-scifi))',
  				fantasy: 'hsl(var(--category-fantasy))',
  			},
  			venue: {
  				cultural: 'hsl(var(--venue-cultural))',
  				cinema: 'hsl(var(--venue-cinema))',
  				outdoor: 'hsl(var(--venue-outdoor))',
  				special: 'hsl(var(--venue-special))',
  			}
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}