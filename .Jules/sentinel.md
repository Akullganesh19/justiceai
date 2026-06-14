## 2025-05-14 - [Disk Space Exhaustion Prevention]
**Vulnerability:** Abandoned temporary files in the `/api/upload` route could lead to Disk Space Exhaustion (DoS) if processing failed or unsupported file types were uploaded.
**Learning:** Multer creates temporary files before the `fileFilter` or route logic runs. If the route logic `continue`s or `throw`s without an explicit `fs.unlinkSync`, these files persist indefinitely in the `uploads/` directory.
**Prevention:** Always wrap file processing logic in a `try...catch...finally` block. The `finally` block must ensure `fs.unlinkSync(filePath)` is called for all temporary files.

## 2025-05-14 - [Information Leakage in Error Responses]
**Vulnerability:** API endpoints were returning raw error messages and stack traces to the client, potentially leaking sensitive architectural details.
**Learning:** Defaulting to `err.message` in JSON responses is a common pattern that becomes a security risk in production.
**Prevention:** Use a `NODE_ENV` check to only return detailed error information in `development` mode. Use a centralized logging system (e.g., Winston) to record the full error details on the server for auditing.
