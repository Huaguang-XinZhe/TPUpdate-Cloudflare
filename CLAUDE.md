# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TPUpdate-Cloudflare is a Cloudflare Worker application that serves as a static content delivery system for Tailwind CSS UI components, templates, and related resources. The project mimics aspects of the Tailwind UI interface, serving pre-generated JSON route data and static assets.

## Commands

### Development
```bash
npm run dev
# or
npm start
```
Starts the local development server at http://localhost:8787/ using Wrangler.

### Deployment
```bash
npm run deploy
```
Deploys the Worker to Cloudflare's edge network.

### Type Generation
```bash
npm run cf-typegen
```
Regenerates TypeScript type definitions for the `Env` interface based on bindings declared in `wrangler.jsonc`. Run this after modifying bindings in the configuration.

## Architecture

### Entry Point
- **src/index.ts**: The main Worker entry point implementing the standard Cloudflare Workers `fetch` handler
  - Handles root path redirects (currently redirects to baidu.com)
  - Processes `X-Inertia` headers for potential SPA-style routing
  - Returns 404 for unhandled routes

### Static Assets System
The project uses Cloudflare Workers' static assets binding:
- **wrangler.jsonc**: Configures the `ASSETS` binding pointing to `./public/`
- Static files are served automatically by Cloudflare's asset server

### Content Structure
1. **public/routes/**: JSON files containing Inertia.js-style route data
   - `index.json`: Home page data with UI component categories, templates, and pricing
   - `changelog.json`, `privacy-policy.json`: Additional route data
   - `templates/*.json`: Individual template metadata (e.g., catalyst.json)
   - Each JSON follows the Inertia.js pattern: `{component, props, url, version}`

2. **public/templates-zip/**: Downloadable template archives
   - Contains zip files for various templates (catalyst.zip, commit.zip, etc.)

3. **public/main-res/**: Static HTML/assets for UI blocks and documentation
   - Marketing, application UI, and ecommerce component examples
   - Documentation pages for various UI elements

### Configuration
- **wrangler.jsonc**: Worker configuration (Chinese comments)
  - Worker name: `tpupdate-cf` (must be lowercase)
  - Compatibility date: 2025-10-08
  - Assets binding enabled for static file serving
  - Observability enabled

- **tsconfig.json**: TypeScript configuration
  - Target: ES2021
  - JSX: react-jsx (suggesting potential React integration)
  - References `worker-configuration.d.ts` for Cloudflare types

### Type Definitions
- **worker-configuration.d.ts**: Large auto-generated file (319KB+) containing Cloudflare Workers type definitions
  - Defines the `Env` interface with bindings
  - Should not be manually edited (regenerate with `npm run cf-typegen`)

## Key Implementation Details

1. **Route Handling Pattern**: The project appears designed to work with Inertia.js, a protocol for building SPAs using server-side routing
   - Routes return JSON data with component names and props
   - The `X-Inertia` header detection suggests frontend integration

2. **Static Asset Delivery**: Uses Cloudflare's native asset serving rather than custom routing
   - More efficient than manual file serving
   - Assets are cached at the edge

3. **Chinese Codebase**: Comments and documentation are in Chinese (Simplified)
   - All inline comments in TypeScript and JSON are in Chinese
   - This should be maintained for consistency

4. **Recent Changes**: Git history shows DurableObject code was removed, simplifying the architecture to a basic Worker + static assets model

## Development Notes

- The Worker is minimal and primarily acts as a smart redirect/routing layer
- Most functionality relies on static JSON data and pre-generated HTML
- No database or external API calls in current implementation
- No build/compilation step required (TypeScript is handled by Wrangler)
