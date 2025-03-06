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
