## 2025-05-14 - [High-End 3D Micro-interactions]
**Learning:** Adding subtle 3D tilt effects using `framer-motion` and `perspective` significantly increases the perceived value and "premium" feel of a landing page without compromising accessibility, provided that the interactions are purely visual and do not interfere with click targets or tab order.

**Action:** Use `whileHover={{ rotateX, rotateY, scale }}` with a high `perspective` value (e.g., 1000px) on feature cards to create depth. Always ensure icon-only buttons in the same view have `aria-label` and `title` to balance high-end visuals with accessibility.

## 2025-05-14 - [CSS Import Order in Production]
**Learning:** Vite/PostCSS are strict about `@import` placement. Placing them after other CSS rules causes build-time warnings/errors that can break styling in production even if it works in dev.

**Action:** Always ensure `@import` statements are at the very top of the main CSS entry point.
