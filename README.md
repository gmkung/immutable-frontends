# Immutable Frontends Registry

A decentralized registry for immutable frontends, powered by Kleros Curate.

## About this project

This application provides a user interface for the Immutable Frontends Registry, a decentralized list of verified immutable frontends. The registry uses Kleros's optimistic curation system to maintain data integrity through economic incentives.

### Key features:

- Browse registered immutable frontends
- Submit new frontends to the registry
- Challenge incorrect submissions
- Request removal of registered frontends
- Challenge removal requests
- All disputes are resolved through Kleros Court's decentralized arbitration

## Design & Theme

The application features a **Dark Gothic Theme** with:

- **Color Palette**: Deep blacks, charcoal grays, purple/violet accents, and crimson highlights
- **Typography**: Cinzel gothic font for headings, Inter for body text
- **Visual Effects**: 
  - Glass-morphism cards with gothic gradients
  - Animated glow effects and flickering elements
  - Custom gothic border styles and shadows
  - Ethereal background patterns and gradients
- **Interactive Elements**: Gothic-styled buttons with purple and blood-red variants

### Theme Colors:
- **Primary**: Deep violet/purple (`#8a2be2`)
- **Accent**: Dark crimson (`#dc143c`) 
- **Background**: Deep black (`#0a0a0a`) with subtle gothic patterns
- **Text**: Light platinum (`#e8e8e8`) with shadow effects

## Getting started

### Prerequisites

- Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Local development

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd immutable-frontends-registry

# Step 3: Install the necessary dependencies
npm i

# Step 4: Start the development server
npm run dev
```

## Technologies

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Ethereum Web3 integration
- IPFS for evidence storage

### Styling Architecture:
- **Tailwind CSS**: Custom gothic color palette and utility classes
- **CSS Variables**: Dynamic theming system for consistent color management
- **Custom Components**: Gothic-themed glass cards, buttons, and interactive elements
- **Animations**: Custom keyframe animations for gothic effects (glow, flicker, blood-drip)

## Deployment

You can deploy this application to any static hosting service like Netlify, Vercel, or GitHub Pages.

```sh
# Build the project
npm run build

# Preview the production build locally
npm run preview
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

When contributing to the gothic theme, please maintain consistency with:
- The established color palette (gothic namespace in Tailwind config)
- Animation and effect styles
- Typography hierarchy using the gothic font family
