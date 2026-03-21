```markdown
# Design System Specification: The Joy of Togetherness

## 1. Overview & Creative North Star
**Creative North Star: "The Living Scrapbook"**

This design system moves away from the sterile, spreadsheet-driven nature of traditional finance apps. Instead, it treats shared expenses as digital mementos of collective experiences. The aesthetic is defined by **Soft Editorial Layering**: a high-end, tactile approach that uses "paper-on-paper" depth, intentional asymmetry, and generous whitespace to create an atmosphere of warmth and trust.

We break the "template" look by avoiding rigid grids. Instead, we use overlapping elements and varied typography scales to guide the eye. The interface shouldn't feel like a tool you *have* to use, but a space where you *want* to celebrate your social life.

---

## 2. Colors & Surface Philosophy
The palette is a sophisticated blend of sun-drenched warms and organic greens, designed to feel premium yet approachable.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to section content. Traditional dividers are replaced by:
- **Tonal Shifts:** Placing a `surface-container-low` card on a `surface` background.
- **Negative Space:** Using the `Spacing Scale` (e.g., `8` or `10`) to create mental boundaries without visual clutter.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of fine paper.
- **Base Layer:** `surface` (#f8f6f2).
- **Secondary Sections:** `surface-container` (#e9e8e4).
- **Interactive Cards:** `surface-container-lowest` (#ffffff) to provide a "pop" of clean white against the cream base.

### The "Glass & Gradient" Rule
To add visual "soul," use a subtle linear gradient on main Action Buttons transitioning from `primary` (#7e5200) to `primary-container` (#fdb64a) at a 45-degree angle. For floating navigation or modal overlays, use **Glassmorphism**:
- **Background:** `surface-container-lowest` at 80% opacity.
- **Effect:** 20px Backdrop Blur. This ensures the warm "JoinJoy" colors bleed through, keeping the experience integrated.

---

## 3. Typography
We utilize a dual-font system to balance "Editorial Personality" with "Functional Clarity."

*   **Display & Headlines (Plus Jakarta Sans):** Chosen for its modern, geometric friendliness. Use `display-lg` for moments of celebration (e.g., "Settled up!") and `headline-md` for screen titles. The wide apertures of this font convey openness.
*   **Body & Titles (Be Vietnam Pro):** A highly readable sans-serif that feels contemporary and clean. `title-md` should be used for transaction names, while `body-md` handles the granular details.

**Hierarchy Note:** Use `on-surface-variant` (#5b5c59) for secondary metadata to create a sophisticated typographic contrast against the deep `on-surface` (#2e2f2d) primary text.

---

## 4. Elevation & Depth
Depth is achieved through **Tonal Layering** rather than heavy shadows.

*   **The Layering Principle:** A `surface-container-highest` element should only ever sit on a `surface-container-low` or `surface` base. This creates a natural, "stepped" hierarchy.
*   **Ambient Shadows:** For high-priority floating elements (like a "Add Expense" FAB), use an extra-diffused shadow:
    *   `box-shadow: 0 12px 32px rgba(46, 47, 45, 0.06);`
    *   The shadow uses a tint of `on-surface` to ensure it feels like a natural shadow cast on a warm surface, never a "dirty" grey.
*   **The "Ghost Border" Fallback:** If a container requires definition against a similar background, use `outline-variant` (#aeadaa) at **15% opacity**. This creates a "suggestion" of an edge rather than a hard stop.

---

## 5. Components

### Buttons
*   **Primary:** Rounded `xl` (1.5rem). Gradient fill (Primary to Primary-Container). Typography: `title-sm` (Bold).
*   **Secondary:** Ghost style. `surface-container-low` background with `on-primary-fixed-variant` text.
*   **Tertiary:** Text-only with `label-md` and a subtle `primary` underline (2px offset).

### Cards & Lists
*   **Expense Cards:** Never use dividers. Use `surface-container-lowest` with a `lg` (1rem) corner radius. Use `2.5` (0.85rem) padding internally.
*   **Asymmetric Layouts:** In list views, slightly offset "Member Avatars" so they overlap the edge of the card, breaking the rectangular container for a more social, "scrapbook" feel.

### Input Fields
*   **Styling:** Soft `md` (0.75rem) corners. `surface-container-low` background. 
*   **Interaction:** On focus, the background transitions to `surface-container-lowest` with a 2px `primary-fixed` "Ghost Border."

### Shared Moment Chips
*   **Usage:** For categorizing expenses (e.g., "Dinner," "Road Trip").
*   **Style:** `full` (9999px) roundedness. `secondary-container` background with `on-secondary-container` text.

---

## 6. Do’s and Don'ts

### Do
*   **Do** use overlapping elements (e.g., an image slightly breaking the container of a card) to create energy.
*   **Do** leverage the `tertiary` (Soft Coral) palette for "Owed" amounts to make them feel urgent but not "scary" like a standard red.
*   **Do** use `16` (5.5rem) spacing at the bottom of long scrolls to allow content to breathe.

### Don’t
*   **Don't** use black (#000000). Use `on-surface` (#2e2f2d) for all "black" text to maintain the warm, organic mood.
*   **Don't** use 90-degree corners. Even the smallest elements (like checkboxes) should use at least the `sm` (0.25rem) radius.
*   **Don't** use standard "Accounting" icons (heavy dollar signs, ledgers). Instead, use lifestyle-focused iconography (fork/knife, suitcases, clinking glasses).

---

## 7. Spacing & Rhythm
Rhythm is dictated by the **1.5x Multiplier Rule**. Our spacing scale (from `0.5` to `24`) ensures that as components grow, the "air" around them grows proportionally. 

*   **Group Spacing:** Use `6` (2rem) between unrelated content blocks.
*   **Internal Padding:** Standardize on `4` (1.4rem) for card gutters to ensure a premium, spacious feel that screams quality over quantity.```