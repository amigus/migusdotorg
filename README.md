# migus.org

Personal website built with Hugo and the Its Business theme.

## Prerequisites

- Hugo Extended v0.147.0 or higher
- Node.js 18.20.4 or higher

## Setup

### Install Dependencies

```bash
npm install
```

### Theme Setup

This site uses the [Its Business](https://github.com/amigus/hugo-its-business) theme.

#### Option 1: Using Git Submodule (Recommended for development)

```bash
git submodule add https://github.com/amigus/hugo-its-business.git themes/its-business
git submodule update --init --recursive
```

#### Option 2: Using a Local Theme Clone

If you prefer to manage the theme separately or for development:

```bash
git clone https://github.com/amigus/hugo-its-business.git themes/its-business
```

**Note:** If using this method, make sure to add `themes/` to your `.gitignore` to avoid committing the theme files.

## Development

### Run Development Server

```bash
npm run serve
```

This will start a local development server at http://localhost:1313

### Run with Drafts

```bash
npm run serve:drafts
```

### Build

```bash
npm run build
```

## Configuration

The site configuration is located in `config/_default/hugo.toml`. The theme is specified with:

```toml
theme = 'its-business'
```

## License

©️ 2024, 2025 Adam Migus. All rights reserved.
