# ppt-board

[English](./README.md) | [简体中文](./README.zh-CN.md)

A fully-featured presentation and editing host application built on top of `vue-canvas-core`. 
It integrates the **NaiveUI** component library and provides a comprehensive plugin system wrapper, acting as the primary entry point for all future presentation editor development.

## Features

- **Built-in UI Context** - Wraps the core engine with NaiveUI's configuration, message, dialog, and notification providers.
- **Plugin System Host** - The primary application host for plugins. Easily develop extensions using our `create-vue-canvas-plugin` CLI.
- **Unified API Surface** - Fully re-exports all components, types, and composables from `@iss-ai/vue-canvas-core`.
- **Infinite Canvas & Slides** - Supports free-form `auto` ratio or fixed presentation ratios.
- **Rich Media & Animation** - Audio and timeline-based animations handled natively.
- **Jest** - Fully configured testing framework with `jsdom` testing capabilities.
- **Babel** - Integration for down-compiling and better browser support.
- **PostCSS & Less** - Configured for styling needs within your package.
- **ESLint & Prettier** - Configured for syntax/style checking with Husky and lint-staged pre-commit hooks.
- **Commitlint** - Enforces Conventional Commits standards on commit messages.
- **release-it** - Automated version bumping, git tagging, changelog generation, and npm publishing.

## Getting Started

Make sure to install dependencies first:

```bash
pnpm install
```

## Available Scripts

In the project directory, you can run:

- `pnpm dev`: Starts the local Vite playground for real-time editor development and UI testing.
- `pnpm build:demo`: Bundles the playground into a production-ready web application in the `playground/dist` directory, ready to be deployed to GitHub Pages or Vercel.
- `pnpm clean`: Cleans the output `lib` directory.
- `pnpm build`: Builds the package for production using Rollup. The outputs are placed in the `lib` directory.
- `pnpm test`: Runs Jest tests.
- `pnpm coveralls`: Runs tests and collects coverage data.
- `pnpm tsc`: Compiles TypeScript without bundling (useful for type checking).
- `pnpm lint`: Lints the codebase with ESLint.
- `pnpm release`: Starts the `release-it` interactive deployment (bumps version, tags, and publishes).

## Development Guidelines

### Commit Convention

This project enforces the [Conventional Commits](https://www.conventionalcommits.org/) specification using `commitlint`.
When you commit your changes, you must format your commit messages with specific prefixes. For example:

- `feat: add a new component` (New feature)
- `fix: resolve a bug` (Bug fix)
- `chore: update dependencies` (Maintenance or config changes)
- `docs: update readme` (Documentation changes)

If you don't follow this format, your commit will be rejected by the Git `commit-msg` hook.

## Usage

1. Write your editor plugins relying directly on `@iss-ai/ppt-board`.
2. Generate new plugins quickly using `npx create-vue-canvas-plugin my-plugin`.
3. Run `pnpm dev` to instantly preview the Canvas Editor in the browser via the `playground/` directory.
4. Test your rich presentation JSON structures by loading them into the playground.
4. Run `pnpm build:demo` to generate a static web application of the playground.
5. Write component unit tests in the `__tests__/` directory and run them with `pnpm test`.
6. Run `pnpm build` to compile the NPM library to `lib`.

## Publishing

This project is configured to publish to the official NPM registry. If you use a domestic mirror (like CNPM or Taobao) locally, you must first log in to the official registry:

```bash
npm login --registry=https://registry.npmjs.org/
pnpm release
```

## License

This project is licensed under the [GNU Affero General Public License v3.0 (AGPL-3.0)](./LICENSE).
