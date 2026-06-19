## 2026-06-18 — class-variance-authority abstraction
**Complexity found:** The `class-variance-authority` (cva) dependency was used to create styling variants for `Label` and `Button` components in `src/components/ui/auth-fuse.tsx`.
**Why it existed:** Likely added to mimic or follow common styling patterns like shadcn UI, which utilizes `cva` for component variants, but here it was only used in a single file with very few variants.
**Eliminated:** The `class-variance-authority` dependency and the `cva()` wrappers.
**Net change:** Eliminated 1 dependency (`class-variance-authority`), removed `cva` imports and wrappers, and replaced them with plain JavaScript objects and inline strings. Added roughly the same number of lines to manually define variants, but removed an entire layer of abstraction.
**Next target:** Evaluate if `@radix-ui` dependencies are strictly necessary or if they can be replaced by native HTML elements in simple components.
