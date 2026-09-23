---
name: shadcn-ui
description: >-
  Enforce Shadcn UI conventions, component reuse, accessibility, responsive design, and consistent styling for all UI development in this project. Activate whenever creating, updating, refactoring, or reviewing UI components, forms, dialogs, dropdowns, tables, and layouts.
---

# Shadcn UI Development Skill

This skill guides all user interface development in the project, ensuring components adhere to Shadcn UI conventions, maintain strict accessibility, match the project's design system, and prioritize reusability over duplication.

---

## Core Component Resolution Hierarchy

Always resolve component needs using this strict priority order:

```
Existing Project Components
        │
        ▼
Shadcn UI Components (Installed / Available)
        │
        ▼
Install Required Shadcn Component (`npx shadcn@latest add <component>`)
        │
        ▼
Compose Reusable Components (Combine existing primitives)
        │
        ▼
Create Custom Component (ONLY when no Shadcn or composed solution exists)
```

> [!IMPORTANT]
> **Do not blindly install or build from scratch.** First inspect existing project components under `src/components` to discover existing patterns, design tokens, and primitives.

---

## 1. Component Discovery & Existing UI First

Before writing any new component code:
1. **Inspect `src/components`**: Search for existing components that already solve or partially solve the requirement.
2. **Review design patterns**: Check how similar UI elements are constructed (e.g. glassmorphism surfaces, borders, button states, modal overlays, popovers).
3. **Reuse & Compose**: Compose existing primitives whenever possible rather than duplicating styles or logic.

---

## 2. Shadcn UI Component Installation & Configuration

When a required component is not yet present:
1. **Check project configuration**: Inspect `components.json` (or verify alias paths such as `@/components/ui`, Tailwind CSS setup, and Lucide icon setup).
2. **Install via CLI**:
   ```bash
   npx shadcn@latest add <component-name>
   ```
   *Examples*: `button`, `dialog`, `dropdown-menu`, `popover`, `sheet`, `table`, `skeleton`, `badge`, `input`, `form`.
3. **Single UI Library Rule**: Do NOT introduce other UI component libraries (e.g. MUI, Chakra, Ant Design, Mantine) unless explicitly requested by the user.
4. **Preserve base components**: Do not make arbitrary modifications to generated `src/components/ui/` primitives; customize them via props, composition, or `className` overrides.

---

## 3. Reusable Component Guidelines

1. **Focused & Small**: Each component should do one job well (Single Responsibility Principle).
2. **Dynamic via Props**: Use props and TypeScript interfaces for dynamic content, states, and callbacks instead of cloning components with hardcoded text.
3. **Extract Repeated Patterns**: If a card, badge, list item, or action group appears more than once, extract it into a reusable component under `src/components/`.
4. **Separation of Concerns**:
   - `src/components/ui/`: Base Shadcn primitives (pure presentation and Radix primitives).
   - `src/components/`: Domain/application-specific reusable components (e.g. `TemplateCard`, `ThemeToggle`, `Header`).

---

## 4. Styling & Design Tokens

1. **Tailwind CSS Utility Classes**:
   - Follow the project's existing theme, spacing scale, border radiuses, shadows, and glassmorphism tokens.
   - Do NOT introduce arbitrary hardcoded hex codes or colors when an existing token (e.g., `bg-blue-950/30`, `border-blue-900/40`, `text-zinc-100`) or theme variable is established.
2. **Dual-Theme Support (Light & Dark Mode)**:
   - Ensure every component explicitly handles both light and dark modes (e.g., `text-zinc-900 dark:text-zinc-100`, `bg-white/90 dark:bg-[#0c162e]/80`).
   - Test contrast and legibility in both themes.
3. **Visual Hierarchy & Harmony**:
   - Maintain consistent border-radius tokens (e.g., `rounded-2xl`, `rounded-3xl` for cards, `rounded-xl` for buttons/inputs).
   - Use subtle transitions (`transition-all duration-200`, `active:scale-[0.99]`).

---

## 5. Accessibility (a11y) Standards

1. **Radix Primitive Integrity**: Never strip out keyboard navigation, ARIA attributes, or focus management provided by Shadcn/Radix components.
2. **Interactive Elements**:
   - Ensure all buttons, links, inputs, and interactive cards are keyboard navigable (`Tab`, `Enter`, `Space`, `Esc`).
   - Use semantic elements (`<button>`, `<nav>`, `<main>`, `<section>`, `<dialog>`).
3. **Accessible Labels**:
   - Provide `aria-label` or `title` on icon-only buttons.
   - Associate form `<label>` elements with their input using `htmlFor` and `id`.
4. **Focus Rings**:
   - Maintain visible focus rings (`focus-visible:ring-2 focus-visible:outline-none`).

---

## 6. Responsive Design

1. **Mobile-First & Breakpoints**:
   - Support mobile (`default`), tablet (`sm:`, `md:`), and desktop (`lg:`, `xl:`, `2xl:`).
   - Use fluid layouts (`w-full max-w-... mx-auto`, `flex-col md:flex-row`, `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`).
2. **No Fixed Constraints**: Avoid hardcoded pixel widths/heights (`w-[380px]`) unless strictly required by design (e.g., avatars, thumbnails).

---

## 7. Forms & User Input

1. **Component Primitives**: Use Shadcn Form, Input, Textarea, Select, Checkbox, RadioGroup primitives.
2. **Clear Feedback**:
   - Visible error states with accessible descriptions.
   - Clear placeholder text and helper hints.
   - Disabled states during async submission (`disabled={isSubmitting}`).

---

## 8. Overlays, Dialogs, Sheets, Dropdowns & Popovers

1. **Use Primitives**: Always use Shadcn / Radix primitives (`Dialog`, `DropdownMenu`, `Sheet`, `Popover`, `Tooltip`) rather than ad-hoc custom `position: absolute` hacks.
2. **Behavior Verification**:
   - Click outside to dismiss.
   - Escape key to close.
   - Focus traps inside modals and focus restoration upon dismissal.
   - Body scroll lock during open modals.

---

## 9. Tables & Data Display

1. **Structured Layout**: Use Shadcn `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableCell`.
2. **State Coverage**: Every table and list view must handle 4 states:
   - **Loading State**: Skeletons matching row structure.
   - **Empty State**: Friendly illustration/message with call-to-action.
   - **Error State**: Non-blocking alert with retry action.
   - **Success/Populated State**: Clean, readable, responsive data display.

---

## 10. Loading, Empty & Error State Patterns

1. **Loading**:
   - Use `Skeleton` components mirroring the layout of cards, lists, or headers.
   - Use animated spinners or shimmer gradients for inline actions.
2. **Empty States**:
   - Clear explanation of why no items are present.
   - Actionable next step (e.g., "Browse Templates", "Clear Filters").
3. **Error States**:
   - Friendly error message explaining what failed.
   - Non-destructive dismiss or retry action.

---

## 11. Icons

1. **Consistency**: Use the project's established icon convention (Lucide React or existing SVG icon system).
2. **Sizing & Stroke**:
   - Match standard sizes: `w-4 h-4` (inline/badges), `w-5 h-5` (buttons), `w-6 h-6` (card icons).
   - Consistent stroke width (e.g., `strokeWidth={2}` or `2.5`).
3. **No Random Libraries**: Do not mix FontAwesome, Material Icons, or arbitrary third-party packs unless requested.

---

## 12. Non-Destructive Development

1. **Preserve Existing Logic**: When modifying an existing component or page, strictly preserve:
   - Existing state (`useState`, `useContext`, custom hooks).
   - Route handling and parameters (`useRouter`, `useParams`).
   - Business logic, analytics, and event handlers.
2. **No Unrelated Code Rewrites**: Do not refactor untouched sections or change unrelated styles.

---

## 13. Pre-Flight Quality Checklist

After completing any UI implementation, verify:

- [ ] **TypeScript**: `npx tsc --noEmit` runs with 0 errors.
- [ ] **Theme Check**: Checked in both Light Mode and Dark Mode.
- [ ] **Responsiveness**: Tested on mobile viewport (<640px), tablet (768px), and desktop (>1024px).
- [ ] **Accessibility**: All buttons and inputs keyboard accessible; ARIA attributes valid.
- [ ] **Reusability**: No copy-pasted UI blocks that should be a shared component.
- [ ] **Zero Unused Code**: Clean imports, no leftover test code or debug logs.
