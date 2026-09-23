# Component Quality & Accessibility Checklist

Use this checklist during code review and verification for all UI components.

## 1. Hierarchy & Reusability
- [ ] Checked if an existing component in `src/components` already provides this UI.
- [ ] Checked if a Shadcn component (`npx shadcn@latest add <name>`) should be used.
- [ ] Extracted repeated visual units into reusable subcomponents.
- [ ] Dynamic values and callbacks are passed via typed props (`interface Props { ... }`).

## 2. Design System & Theming
- [ ] Colors use Tailwind theme tokens (`text-zinc-900 dark:text-white`, `border-blue-900/40`, etc.).
- [ ] No hardcoded arbitrary color values that break theme consistency.
- [ ] Surface styling matches dark glass / glassmorphism system when appropriate.
- [ ] Border radius matches system scale (`rounded-xl` for controls, `rounded-2xl` or `rounded-3xl` for cards).

## 3. Accessibility & Keyboard Control
- [ ] Interactive elements use semantic HTML (`<button>`, `<a>`, `<input>`).
- [ ] Focus rings are visible on keyboard focus (`focus-visible:ring-2 focus-visible:outline-none`).
- [ ] Icon-only buttons have descriptive `aria-label` or `title`.
- [ ] Dialogs, dropdowns, and popovers close on `Escape` and restore focus on dismiss.
- [ ] Form controls have connected `<label htmlFor="...">`.

## 4. Responsive Layouts
- [ ] Mobile viewport tested (<640px): no horizontal overflow or clipped text.
- [ ] Tablet viewport tested (640px - 1024px): layout adapts smoothly.
- [ ] Desktop viewport tested (>1024px): columns and grid scale appropriately.

## 5. State Handling
- [ ] Loading state handled (skeleton or spinner).
- [ ] Empty state handled (informative message + CTA).
- [ ] Error state handled (user-friendly message + retry).
- [ ] Populated/success state looks clean and balanced.

## 6. Code Health
- [ ] TypeScript check passes with zero errors (`npx tsc --noEmit`).
- [ ] No unused imports or dead code.
- [ ] Existing business logic and route params are intact.
