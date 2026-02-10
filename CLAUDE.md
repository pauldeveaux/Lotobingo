# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (port 3000)
npm run build    # Build for production
npm run test     # Run all tests with Vitest
npm run test -- path/to/file.test.ts  # Run a single test file
```

## Architecture

This is a real-time bingo/loto management application built with Nuxt 4.

### Real-time Sync Architecture

The app uses a WebSocket-based admin-client architecture:
- **Admin page** (`/loto/admin`) controls the game and broadcasts state changes
- **Client page** (`/loto/client`) receives updates for projection display
- WebSocket server runs on port 3001 via Nitro plugin (`server/plugins/websocket.ts`)
- The `useWebSocket` composable is a singleton that maintains connection state across components

Message types: `SYNC` (bingo + optional prize), `SYNC_PRIZE`, `REQUEST_SYNC`

### State Management

Pinia stores with localStorage persistence:
- `useBingoStore` - Multiple bingo games, drawing logic, game lifecycle
- `usePrizeStore` - Prize management with photo support
- `useCardStore` / `useCardStyleStore` - Bingo card generation (75-ball American or 90-ball European)

### Key Patterns

- Types are centralized in `app/types/` (e.g., `Bingo`, `Prize`, `BingoSettings`)
- Utility functions in `app/utils/` (e.g., `createBingoFromSettings`)
- Test files are colocated with source (e.g., `useBingoStore.test.ts`)
- Vitest with jsdom environment; uses `@/` and `~/` aliases pointing to `./app`

### Routes

- `/` - Home
- `/loto/admin` - Draw management
- `/loto/client` - Projection display
- `/settings` - Game and prize configuration
- `/cards` - Bingo card generation and styling
