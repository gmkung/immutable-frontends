import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
				mono: ['JetBrains Mono', 'monospace'],
				gothic: ['Cinzel', 'serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Gothic-themed colors
				gothic: {
					black: '#0a0a0a',
					charcoal: '#1a1a1a',
					slate: '#2a2a2a',
					ash: '#3a3a3a',
					silver: '#b8b8b8',
					platinum: '#e8e8e8',
					blood: '#8b0000',
					crimson: '#dc143c',
					wine: '#722f37',
					purple: '#4a0e4e',
					violet: '#8a2be2',
					amethyst: '#9966cc',
					gold: '#ffd700',
					bronze: '#cd7f32'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
				'fade-out': {
					'0%': { opacity: '1' },
					'100%': { opacity: '0' },
				},
				'slide-up': {
					'0%': { transform: 'translateY(10px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' },
				},
				'slide-down': {
					'0%': { transform: 'translateY(-10px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' },
				},
				'pulse-slow': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.8' },
				},
				'flicker': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.3' },
				},
				'glow': {
					'0%, 100%': { 
						boxShadow: '0 0 5px theme("colors.gothic.violet"), 0 0 20px rgba(138, 43, 226, 0.3)'
					},
					'50%': { 
						boxShadow: '0 0 10px theme("colors.gothic.violet"), 0 0 30px rgba(138, 43, 226, 0.5)'
					},
				},
				'blood-drip': {
					'0%': { transform: 'translateY(-5px)' },
					'100%': { transform: 'translateY(5px)' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'fade-out': 'fade-out 0.3s ease-out',
				'slide-up': 'slide-up 0.4s ease-out',
				'slide-down': 'slide-down 0.4s ease-out',
				'pulse-slow': 'pulse-slow 3s ease-in-out infinite',
				'flicker': 'flicker 2s ease-in-out infinite',
				'glow': 'glow 3s ease-in-out infinite',
				'blood-drip': 'blood-drip 3s ease-in-out infinite',
			},
			backdropFilter: {
				'none': 'none',
				'blur': 'blur(20px)',
			},
			boxShadow: {
				'glass': '0 4px 30px rgba(0, 0, 0, 0.8)',
				'glass-hover': '0 4px 40px rgba(0, 0, 0, 0.9)',
				'gothic': '0 0 10px theme("colors.gothic.violet"), 0 0 30px rgba(138, 43, 226, 0.2)',
				'gothic-hover': '0 0 15px theme("colors.gothic.violet"), 0 0 40px rgba(138, 43, 226, 0.4)',
				'blood': '0 0 8px theme("colors.gothic.crimson"), 0 0 25px rgba(220, 20, 60, 0.3)',
				'blood-hover': '0 0 12px theme("colors.gothic.crimson"), 0 0 35px rgba(220, 20, 60, 0.5)',
			},
			backgroundImage: {
				'gradient-gothic': 'linear-gradient(135deg, #4a0e4e, #8a2be2, #2a2a2a)',
				'gradient-blood': 'linear-gradient(135deg, #8b0000, #dc143c, #722f37)',
				'gradient-shadow': 'linear-gradient(135deg, #0a0a0a, #2a2a2a, #1a1a1a)',
				'gothic-pattern': "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 5L60 35L90 35L68 55L78 85L50 65L22 85L32 55L10 35L40 35Z' fill='rgba(138, 43, 226, 0.05)' /%3E%3C/svg%3E\")",
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
