## Project Structure

The project should use a clear separation between routing, page composition, reusable components, UI components, hooks, services, stores, and types.

Use the existing project structure as the starting point, but refactor duplicated or misplaced code when necessary.

The preferred structure is:

```text
app/
  page.tsx
  name-page/
    page.tsx

components/
  shared/
    home/
      index.tsx
      HomeHeader.tsx
      CalorieProgress.tsx
      MacroCards.tsx
      AddFoodCard.tsx
      RecentMeals.tsx
      RecentMealItem.tsx
      FoodSourceModal.tsx
      FoodPreview.tsx
      FoodAnalysisResult.tsx

    name-page/
      index.tsx
      ...

  ui/
    ...

hooks/
  ...

services/
  storage/
    foodDiaryStorage.ts
    goalsStorage.ts
  ai/
    ...

stores/
  ...

types/
  ...

lib/
  ...

```

The exact structure should be adapted to the existing project.

Do not blindly create folders or duplicate existing files.

---

## App Router Pages

Files inside `app/` should primarily be responsible for routing and rendering the corresponding page component.

For example:

```tsx
// app/home/page.tsx

import HomePage from '@/components/shared/home';

export default function Page() {
  return <HomePage />;
}
```

The main page logic, composition, state handling, and user interactions should NOT be placed directly inside:

```text
app/name-page/page.tsx
```

Instead, the page implementation should live in:

```text
components/shared/name-page/index.tsx
```

For example:

```text
app/
  profile/
    page.tsx

components/
  shared/
    profile/
      index.tsx
```

The `page.tsx` file should stay as thin as reasonably possible.

Do not put hundreds of lines of UI or business logic inside App Router page files.

---

## Shared Components

The `components/shared/` directory contains page-level components and reusable application-specific components.

Each major application page should have its own folder when the page contains meaningful UI or logic.

Example:

```text
components/shared/
  home/
    index.tsx
    HomeHeader.tsx
    CalorieProgress.tsx
    MacroCards.tsx

  diary/
    index.tsx
    MealList.tsx
    MealItem.tsx

  profile/
    index.tsx
    ProfileHeader.tsx
    GoalSettings.tsx
```

The `index.tsx` file should act as the main composition component for that page.

If a component is only used by one page, it can remain inside that page's folder.

If the same component or logic is used by multiple pages, extract it into an appropriate shared location instead of duplicating it.

---

## Avoid Duplication

Before creating a new component, hook, utility, type, or service:

1. Search the existing project.
2. Check whether similar functionality already exists.
3. Reuse it if possible.
4. If there are multiple duplicated implementations, consolidate them into one reusable implementation.
5. Update existing usages to use the shared implementation.

Do not create files such as:

```text
useFood.ts
useFoodData.ts
useFoodEntries.ts
```

if they all contain essentially the same logic.

Likewise, do not create multiple visually identical buttons, cards, modals, inputs, or other UI components when an existing component can be reused.

The goal is to reduce duplication rather than continuously add new abstractions.

---

## Hooks

Hooks should contain reusable stateful logic and interaction logic.

Examples:

```text
hooks/
  useFoodDiary.ts
  useFoodAnalysis.ts
  useImageInput.ts
  useGoals.ts
```

Hooks should not contain large amounts of presentation markup.

They should also avoid directly duplicating business logic that already exists in services.

Preferred flow:

```text
Component
    ↓
Hook
    ↓
Service / Store
    ↓
localStorage / AI API
```

Use hooks for reusable logic that is naturally connected to React.

Do not create a hook simply to move a few lines of code into another file.

---

## Zustand

Use Zustand as the project's state management solution.

Do not introduce Redux, Context-based global state, or another state management library if Zustand is already being used.

Keep Zustand stores focused and minimal.

Example:

```text
stores/
  foodDiaryStore.ts
  goalsStore.ts
  uiStore.ts
```

Only state that genuinely needs to be shared across multiple components or pages should be placed in Zustand.

Temporary UI state should remain local to the component when possible.

For example:

```text
isModalOpen
selectedImage
isAnalyzing
analysisResult
```

do not automatically need to become global state.

Zustand should not replace services.

The store should coordinate application state, while services handle external persistence and API operations.

Preferred architecture:

```text
UI
 ↓
Hook
 ↓
Zustand Store
 ↓
Service
 ↓
localStorage / AI API
```

Do not put raw `localStorage` access or provider-specific AI requests directly inside Zustand stores unless there is a strong architectural reason.

---

## UI Components

The project should use the existing `components/ui/` component system whenever possible.

Before creating a new button, input, dialog, card, dropdown, progress component, or similar primitive:

1. Check `components/ui/`.
2. Reuse an existing component if it fits.
3. Extend an existing component if appropriate.
4. Only create a new primitive when the existing UI system genuinely cannot support the requirement.

Do not create duplicate UI primitives.

For example, if the project already contains:

```text
components/ui/button.tsx
```

use that button throughout the application instead of creating custom buttons inside individual pages.

The application should have a consistent visual language.

---

## Global Styling

Inspect the existing:

```text
app/globals.css
```

or equivalent global stylesheet before implementing UI.

Update the global styling system to match the application's visual direction.

The visual system should be based on:

- dark interface;
- green accent color;
- modern neutral background colors;
- rounded cards;
- strong typography hierarchy;
- subtle borders;
- appropriate contrast;
- polished spacing;
- mobile-first sizing.

Do not randomly define colors inside individual components when they should belong to the global design system.

Prefer existing Tailwind/theme variables or CSS variables when available.

If the project already has a theme system, extend it instead of creating a second styling system.

All UI should feel like one cohesive mobile application.

---

## UI Design System

Use the UI components and global theme consistently throughout the application.

Buttons, cards, inputs, dialogs, navigation items, badges, progress indicators, and other repeated elements should share the same design language.

Do not create one-off styles that make individual pages look like separate applications.

The visual hierarchy should remain consistent across:

```text
Home
Diary
Food Analysis
Profile
Goals
Settings
```

The green accent should be used consistently for primary actions and important progress states without overwhelming the interface.

---

## Page Architecture

A typical page should follow this structure:

```text
app/
  name-page/
    page.tsx

        ↓

components/
  shared/
    name-page/
      index.tsx
      ComponentA.tsx
      ComponentB.tsx

        ↓

hooks/
  useSomething.ts

        ↓

stores/
  somethingStore.ts

        ↓

services/
  somethingService.ts

        ↓

localStorage / AI API
```

Example:

```text
app/
  diary/
    page.tsx

components/
  shared/
    diary/
      index.tsx
      DiaryHeader.tsx
      DailySummary.tsx
      MealList.tsx
      MealItem.tsx

hooks/
  useFoodDiary.ts

stores/
  foodDiaryStore.ts

services/
  storage/
    foodDiaryStorage.ts
```

The exact number of files should depend on complexity.

Do not split tiny components into separate files just for the sake of having more files.

---

## Refactoring Existing Code

When implementing the architecture, inspect the existing codebase first.

If the project already contains:

- duplicated components;
- duplicated hooks;
- repeated calculations;
- repeated UI markup;
- repeated types;
- multiple implementations of the same functionality;
- page logic directly inside `app/*/page.tsx`;

refactor them into the appropriate shared location instead of creating another implementation.

Existing files should be reused or moved when practical.

Do not rewrite unrelated functionality.

Do not introduce unnecessary abstractions merely to make the folder structure look more complex.

The final architecture should be simple enough for another developer to understand quickly.

---

## Important Implementation Rule

Before writing new code, inspect the existing project structure and implementation.

Determine:

1. Which UI components already exist.
2. Which hooks already exist.
3. Which types already exist.
4. Which utilities already exist.
5. Which Zustand stores already exist.
6. Which services already exist.
7. Which components contain duplicated logic.
8. Which styles and theme variables already exist.

Then integrate the new functionality into the existing architecture.

Do not blindly follow example filenames from this document if equivalent files already exist.

Reuse and refactor existing code instead of creating duplicates.

The architecture should evolve from the existing codebase rather than replacing it unnecessarily.
