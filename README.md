# HKAFF 2025 Screening Selector

A responsive web application for Hong Kong Asian Film Festival 2025 attendees to browse films, select screenings, manage their schedule, and detect conflicts.

## 🎬 Features

- **Film Browsing**: Browse complete festival catalogue with posters and details
- **Smart Filtering**: Filter by category and venue
- **Schedule Management**: Add/remove screenings to your personal schedule
- **Conflict Detection**: Automatically detects time overlaps and travel time conflicts
- **Bilingual Support**: Toggle between Traditional Chinese and English
- **Offline-First**: Works offline with LocalStorage persistence
- **Markdown Export**: Export your schedule to markdown format
- **Responsive Design**: Mobile-first design that works on all devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm 10+

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit http://localhost:5173 to see the app.

### Build for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

## 📊 Tech Stack

- **Frontend**: React 18, TypeScript 5, Vite 7
- **Styling**: Tailwind CSS 4
- **i18n**: react-i18next
- **Date/Time**: date-fns v4
- **Testing**: Vitest (unit/contract), Playwright (E2E)
- **Data**: Static JSON files

## 🧪 Testing

```bash
# Run all tests
npm test

# Run contract tests
npm run test:contract

# Run unit tests
npm run test:unit

# Run E2E tests
npm run test:e2e
```

## 📦 Deployment

### Cloudflare Pages (Recommended)

1. Connect your GitHub repository to Cloudflare Pages
2. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: (leave empty)
   - **Environment variables**: None required

3. Deploy! Cloudflare Pages will automatically deploy on every push to main.

### Other Platforms

The app can be deployed to any static hosting service:

- **Vercel**: Zero-config deployment
- **Netlify**: Build command: `npm run build`, Publish directory: `dist`
- **GitHub Pages**: Use `gh-pages` branch with `dist` folder
- **AWS S3**: Upload `dist` folder contents

## 📁 Project Structure

```
hkaff-2025-selector/
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # Business logic services
│   │   ├── utils/          # Utility functions
│   │   ├── i18n/           # Internationalization
│   │   └── types/          # TypeScript types
│   ├── public/
│   │   ├── data/           # Static JSON data
│   │   ├── locales/        # Translation files
│   │   └── posters/        # Film posters
│   └── tests/              # Test files
├── scripts/                # Data scraping scripts
├── specs/                  # Design documents
└── tests/                  # Root-level tests

```

## 🎯 Performance

- **Bundle Size**: 75.6 KB gzipped (well under 180 KB target)
- **CSS Bundle**: 21.2 KB (4.45 KB gzipped)
- **Test Coverage**: 124 tests passing
- **TypeScript**: Zero errors
- **Build Time**: <3 seconds

## 📝 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode

### Key Services

- **DataLoader**: Loads static JSON data
- **StorageService**: Manages LocalStorage with versioned schema
- **ConflictDetector**: Detects time conflicts and travel time issues
- **MarkdownExporter**: Exports schedule to markdown
- **ScheduleService**: Manages schedule aggregation and stats

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📄 License

MIT

## 👨‍💻 Author

yellowcandle

## 🙏 Acknowledgments

- Hong Kong Asian Film Festival for inspiration
- Built with [Claude Code](https://claude.com/claude-code)
