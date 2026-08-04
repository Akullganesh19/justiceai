I need to fix the ESLint error in `src/pages/DocumentGeneratorPage.jsx`.
It complains about `setSavedDocuments` inside `useEffect` being called synchronously. To fix it, I can initialize the `savedDocuments` state directly with the lazy initializer instead of using a `useEffect`, similar to what's done in `ChatPage.jsx`.

And `isEditing` is unused, so I'll prefix it with `_` or remove it.
