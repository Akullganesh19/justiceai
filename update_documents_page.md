1. Modify `DocumentsPage.jsx` to load and display saved documents. Add the `savedDocuments` state to `DocumentsPage`.
2. Add a tab toggle for "Templates" vs "Saved Documents" when `stage === 'select'`.
3. In `DocumentPreview`, add a `onSave` prop, and a "Save Document" button next to "Download PDF". When clicked, it saves the generated document to `savedDocuments`.
