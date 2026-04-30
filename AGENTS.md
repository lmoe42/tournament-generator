# Agent Guidelines for tournament-generator

## Project Overview

- **Type**: React + TypeScript web application
- **Framework**: Vite
- **Testing**: Vitest
- **UI Library**: Material-UI (MUI)
- **Routing**: React Router
- **State**: React hooks (useState, useEffect)
- **Persistence**: localStorage

---

## Build, Lint, and Test Commands

### Development

```bash
npm start          # Start Vite dev server (http://localhost:5173)
```

### Building

```bash
npm run build      # Run TypeScript compiler + Vite build
npm run preview    # Preview production build
```

### Testing

```bash
npm test                    # Run all tests (watch mode)
npm test -- --run          # Run tests once (CI mode)
npm test resultCalculation  # Run single test file (partial match)
npm test src/tests/resultCalculation.test.ts  # Run specific test file
```

### Linting & Formatting

```bash
npx eslint src/             # Lint source files
npx prettier --write src/   # Format source files
```

---

## Code Style Guidelines

### TypeScript Configuration

- **Strict mode enabled** in `tsconfig.json`
- Base URL: `src` (use absolute imports like `import { X } from 'types'`)
- Target: ESNext
- JSX: react-jsx

### Prettier Rules (from `.prettierrc.json`)

```json
{
  "singleQuote": true,
  "semi": true,
  "trailingComma": "all",
  "printWidth": 120,
  "tabWidth": 2,
  "bracketSpacing": true
}
```

### ESLint Configuration

- Extends: `eslint:recommended`, `plugin:react/recommended`, `plugin:@typescript-eslint/recommended`
- Parser: `@typescript-eslint/parser`
- **Note**: `@typescript-eslint/no-non-null-assertion` is disabled (be careful with `!`)

---

## Naming Conventions

| Type             | Convention                  | Example                                  |
| ---------------- | --------------------------- | ---------------------------------------- |
| Components       | PascalCase                  | `TournamentStrongman`, `EventsModal`     |
| Types/Interfaces | PascalCase                  | `Tournament`, `StrongmanEvent`           |
| Enums            | PascalCase                  | `TournamentTypes.STRONGMAN`              |
| Functions        | camelCase                   | `calculatePoints`, `saveTournament`      |
| Variables        | camelCase                   | `existingTournaments`, `eventResults`    |
| Files            | kebab-case                  | `resultCalculation.ts`, `persistance.ts` |
| React hooks      | camelCase with `use` prefix | `useState`, `useParticipants`            |

---

## Import Organization

### Order (top to bottom)

1. External libraries (React, React Router)
2. MUI components/icons
3. Internal imports (use path aliases)
   - `'types'` → `src/types`
   - `'logic/*'` → `src/logic/*`
   - `'components/*'` → `src/components/*`

### Example

```typescript
import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Tournament, StrongmanEvent } from 'types';
import { calculatePoints } from 'logic/resultCalculation';
import { saveTournament } from 'logic/persistance';
import TournamentStrongman from 'components/TournamentStrongman';
```

---

## Component Patterns

### Functional Components

```typescript
import React from 'react';

interface ComponentNameProps {
  prop1: string;
  prop2?: number;
}

const ComponentName: React.FC<ComponentNameProps> = ({ prop1, prop2 = 10 }) => {
  // hooks at top
  const [state, setState] = useState<string>('');

  // handlers
  const handleAction = () => {
    /* ... */
  };

  // render
  return <div>{prop1}</div>;
};

export default ComponentName;
```

### Using MUI with TypeScript

- Use `sx` prop for inline styles or `makeStyles` for reusable styles
- Theme typing: `Theme` from `@mui/material/styles`

---

## Type Definitions

### Use Enums for Fixed Values

```typescript
export enum TournamentTypes {
  STRONGMAN = 'Strongman',
}

export enum StrongmanEventTypes {
  WEIGHT = 'weight',
  REPS = 'reps',
  TIME_S = 'time for speed',
  TIME_E = 'time for endurance',
  CUSTOM = 'custom',
}
```

### Use Type Aliases for Records

```typescript
export type EndResult = Record<string, Placing>;
export type EventResult = Record<string, Score>;
export type EventResults = Record<string, EventResult>;
```

---

## Error Handling

### LocalStorage Access

Always handle potential parse errors:

```typescript
const getData = () => {
  try {
    return JSON.parse(localStorage.getItem('key') || '[]');
  } catch (e) {
    console.error('Failed to parse', e);
    return [];
  }
};
```

### Input Validation

- Validate user input before processing
- Use type guards when necessary
- Handle optional properties with proper defaults

---

## Testing Guidelines

### Test File Naming

- Pattern: `*.test.ts` or `*.test.tsx`
- Location: Same directory as source, or `src/tests/`

### Test Structure

```typescript
import { describe, expect, it } from 'vitest';

describe('ModuleName', () => {
  describe('functionName', () => {
    it('should do something specific', () => {
      const result = functionName(input);
      expect(result).toEqual(expected);
    });
  });
});
```

### Test Best Practices

- Test one thing per `it` block
- Use descriptive test names
- Test edge cases (empty arrays, zeros, duplicates)
- Group related tests with `describe`

---

## File Organization

```
src/
├── components/      # React components
├── logic/           # Business logic (pure functions)
├── types/           # TypeScript types, interfaces, enums
├── tests/           # Test files
├── App.tsx          # Root component
├── Routes.tsx       # Route definitions
└── main.tsx        # Entry point
```

---

## Common Patterns

### State with Persistence

```typescript
const [data, setData] = useState<T>(initialValue);

const updateData = (newValue: T) => {
  setData(newValue);
  saveToLocalStorage(newValue);
};
```

### Conditional Rendering

```typescript
{
  condition && <Component />;
}
{
  condition ? <TrueComponent /> : <FalseComponent />;
}
```

### Event Handler Typing

```typescript
const handleClick = (event: React.MouseEvent<HTMLElement>) => {};
const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {};
```

---

## Important Notes

1. **No non-null assertions**: Avoid `!` operator unless absolutely certain
2. **Strict null checks**: Always handle `undefined` and `null` cases
3. **localStorage**: Data is persisted in browser localStorage - no backend
4. **Path aliases**: Use `src` as base URL for imports
