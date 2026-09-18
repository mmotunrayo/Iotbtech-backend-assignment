# Theory Questions

## Class 31 — Node.js Core & Streams

**Q1. What is Node.js and what makes it different from traditional server-side environments?**

Node.js is a runtime environment that executes JavaScript outside the browser using the V8 engine. Unlike traditional multi-threaded server environments (e.g., Apache/PHP), Node.js runs on a single thread with a non-blocking, event-driven I/O model. This means it can handle thousands of concurrent connections without creating a new thread per request, making it memory-efficient for I/O-bound workloads.

---

**Q2. Explain the Node.js event loop. What are its phases?**

The event loop is the mechanism that allows Node.js to perform non-blocking I/O by offloading operations to the operating system. Its main phases are:
1. **Timers** — executes `setTimeout` and `setInterval` callbacks whose delay has expired.
2. **Pending callbacks** — executes I/O callbacks deferred to the next loop.
3. **Idle / Prepare** — internal use only.
4. **Poll** — retrieves new I/O events; executes I/O-related callbacks.
5. **Check** — executes `setImmediate` callbacks.
6. **Close callbacks** — executes close events (e.g., `socket.on('close', ...)`).

Between each phase, Node.js processes the `nextTick` queue and microtask (Promise) queue before moving forward.

---

**Q3. What is the difference between `process.nextTick()` and `setImmediate()`?**

- `process.nextTick()` fires **before** the next iteration of the event loop — its callback is added to the "nextTick queue" and runs after the current operation completes but before any I/O events.
- `setImmediate()` fires **on the next iteration** of the event loop, specifically in the **check** phase, after I/O events have been processed.

In practice, `process.nextTick()` has higher priority and can starve the event loop if called recursively; `setImmediate()` is preferred for deferring work past I/O.

---

**Q4. What are Node.js Streams and what are the four stream types?**

Streams are objects that let you read or write data in chunks rather than loading everything into memory at once. This is ideal for large files or real-time data. The four types are:

1. **Readable** — source of data you can read from (e.g., `fs.createReadStream`).
2. **Writable** — destination you can write to (e.g., `fs.createWriteStream`).
3. **Duplex** — both readable and writable (e.g., a TCP socket).
4. **Transform** — a duplex stream that transforms data as it passes through (e.g., `zlib.createGzip`).

---

**Q5. What is back-pressure in streams and how does Node.js handle it?**

Back-pressure occurs when a writable stream cannot consume data as fast as a readable stream produces it, causing memory to grow unboundedly. Node.js handles this through the `drain` event and the return value of `writable.write()`. When `write()` returns `false`, the readable source should pause (call `readable.pause()`). Once the writable buffer drains, it emits `'drain'` and the source can resume. The `.pipe()` method manages this automatically.

---

**Q6. Explain the CommonJS module system. How does `require` work under the hood?**

CommonJS is the default module system in Node.js. When you call `require('module')`:
1. Node resolves the file path (checking core modules, then `node_modules`, then relative paths).
2. The file is wrapped in a module wrapper function: `(function(exports, require, module, __filename, __dirname) { /* code */ })`.
3. The wrapped code is compiled and executed.
4. The result is cached in `require.cache` so subsequent `require` calls return the cached exports without re-executing the file.
5. The `module.exports` object is returned to the caller.

---

**Q7. What is the difference between `module.exports` and `exports`?**

`exports` is simply a reference to `module.exports`. You can add properties to `exports` and they appear on `module.exports`:

```js
exports.greet = () => 'hello'; // works fine
```

However, if you reassign `exports` entirely, you break the reference:

```js
exports = { greet: () => 'hello' }; // does NOT work — module.exports is still {}
```

To export a single value (class, function, object), you must assign to `module.exports` directly.

---

## Class 32 — TypeScript & Express Fundamentals

**Q8. What is TypeScript and what advantages does it offer over plain JavaScript?**

TypeScript is a statically typed superset of JavaScript that compiles to plain JavaScript. Key advantages:
- **Type safety** — catches type mismatches at compile time rather than runtime.
- **Improved IDE support** — autocompletion, refactoring, and inline docs are more accurate.
- **Better documentation** — interfaces and type aliases serve as living documentation.
- **Modern features** — decorators, enums, and advanced generics, compiled down for older targets.
- **Easier refactoring** — the compiler surfaces all usages of a changed symbol.

---

**Q9. What are TypeScript interfaces vs. type aliases? When would you use each?**

Both describe the shape of an object, but they differ:

| | Interface | Type Alias |
|---|---|---|
| Extends | `extends` keyword | `&` intersection |
| Declaration merging | ✅ Yes | ❌ No |
| Can describe primitives/unions | ❌ No | ✅ Yes |

**Use interfaces** when modelling objects/classes that may be extended or implemented by others. **Use type aliases** for unions, intersections, mapped types, or when you need to alias a primitive.

---

**Q10. Explain TypeScript generics with an example.**

Generics allow you to write reusable code that works with different types while preserving type safety. Example:

```typescript
function identity<T>(value: T): T {
  return value;
}

const num = identity<number>(42);   // T = number
const str = identity<string>('hi'); // T = string
```

Generics are widely used in utility types (`Array<T>`, `Promise<T>`), repository patterns, and API response wrappers.

---

**Q11. What is Express.js and what problem does it solve?**

Express.js is a minimal, unopinionated web framework for Node.js. It sits on top of Node's `http` module and provides:
- A clean routing API (`app.get`, `app.post`, etc.).
- Middleware composition via `app.use`.
- Request/response helpers (JSON parsing, cookie handling, redirects).
- A plugin ecosystem for auth, validation, templating, etc.

Without Express, developers would manually parse URLs, handle headers, and manage routing using low-level `http.createServer` callbacks.

---

**Q12. Explain the Express middleware pipeline. How does `next()` work?**

In Express, every route handler and `app.use` callback is a middleware function with the signature `(req, res, next)`. When a request arrives, Express runs middleware in registration order:

- If a middleware calls `next()`, Express moves to the next matching middleware.
- If `next(err)` is called with an argument, Express skips to the first error-handling middleware (4-argument: `(err, req, res, next)`).
- If a middleware sends a response (`res.json()`, `res.send()`), the chain stops.

This pipeline is what enables cross-cutting concerns like logging, auth, and error handling to be applied declaratively.

---

**Q13. What is the difference between `app.use()` and `app.get()` in Express?**

- `app.use(path, handler)` matches **any HTTP method** whose URL starts with `path`. It is primarily used for middleware and sub-routers.
- `app.get(path, handler)` matches only **GET** requests with an exact path (plus Express route params).

`app.use('/api', router)` mounts an entire sub-router under `/api`, while `app.get('/api/users', handler)` handles only `GET /api/users`.

---

**Q14. What are Express Router objects and why are they useful?**

`express.Router()` creates a mini-application that can define its own middleware and routes. Routers are useful for:
- **Modularity** — each resource (users, products) owns its router file.
- **Prefix mounting** — `app.use('/api/v1', userRouter)` avoids repeating the prefix in every route.
- **Reusability** — a router can be mounted at multiple paths.

```typescript
const router = express.Router();
router.get('/', getAll);
router.post('/', create);
export default router;
```

---

## Class 33 — Middleware, Logging & Production Patterns

**Q15. What is Winston and why is it preferred over `console.log` in production?**

Winston is a versatile logging library for Node.js. It is preferred over `console.log` because:
- **Log levels** (`error`, `warn`, `info`, `http`, `verbose`, `debug`, `silly`) let you control verbosity per environment.
- **Transports** — simultaneously write to the console, files, remote services (e.g., Datadog, Elasticsearch).
- **Structured logging** — logs JSON by default, making them machine-parseable.
- **Timestamps & metadata** — adds context automatically.
- **`console.log` bypasses** log levels and transports, making it impossible to silence in production without modifying code.

---

**Q16. Explain the concept of log levels and when to use each.**

Winston follows the npm log levels (lower number = higher severity):

| Level | Value | When to use |
|-------|-------|-------------|
| error | 0 | Unrecoverable failures, exceptions |
| warn | 1 | Degraded state, recoverable issues |
| info | 2 | Significant lifecycle events (server start, DB connected) |
| http | 3 | Incoming HTTP requests |
| verbose | 4 | Detailed diagnostic info |
| debug | 5 | Low-level tracing during development |
| silly | 6 | Maximum verbosity |

In production, set `LOG_LEVEL=info` to suppress debug noise. In development, use `debug` or `silly`.

---

**Q17. What is an API key and how does API key authentication work?**

An API key is a secret token issued to a client that proves identity and grants access to an API. The typical flow:
1. The server generates a random, high-entropy string and stores it (often hashed) in a database or environment variable.
2. The client includes the key in every request — typically in an `x-api-key` header or query parameter.
3. Middleware on the server extracts the key, validates it, and either allows the request to proceed or returns `401 Unauthorized`.

API keys are simpler than OAuth but offer no per-user scoping; they are best suited for server-to-server communication where the key can be kept secret.

---

**Q18. What is the purpose of a global error handler in Express? How is it different from try/catch?**

A global error handler (`app.use((err, req, res, next) => {...})`) is a four-argument middleware registered last. It centralises error responses so every route doesn't need its own `try/catch` and error formatting logic. Benefits:
- Consistent JSON error shape across the entire API.
- Single place to log errors with full stack traces.
- Separates error handling from business logic.

`try/catch` handles errors **locally** within a route. The global handler handles errors **globally** — it receives anything passed via `next(err)`, whether from synchronous code or async rejections (Express 5 auto-catches async throws; in Express 4 you must `next(err)` manually in async routes).

---

**Q19. What is CORS and when do you need to handle it in an Express API?**

CORS (Cross-Origin Resource Sharing) is a browser security mechanism that blocks web pages from making requests to a different origin (protocol + domain + port) than the page was served from. You need to handle CORS when:
- Your API is consumed by a browser-based frontend hosted on a different domain.
- You want to restrict which origins are allowed to call your API.

In Express, the `cors` npm package makes it easy:

```typescript
import cors from 'cors';
app.use(cors({ origin: 'https://myfrontend.com' }));
```

Server-to-server requests (cURL, Postman, other backends) are not subject to CORS restrictions.

---

**Q20. Explain environment variables and why you should never hardcode secrets in source code.**

Environment variables are key-value pairs provided by the operating system or a `.env` file at runtime. They keep configuration (database URLs, API keys, ports) separate from code. Reasons never to hardcode secrets:
- **Security** — committed secrets in git history can be extracted by anyone with repo access, even after deletion.
- **Portability** — different environments (dev, staging, production) need different values; env vars let the same code run everywhere.
- **Rotation** — rotating a secret only requires updating the environment, not deploying new code.

The `dotenv` package loads `.env` files into `process.env` during development; production environments inject vars via CI/CD or secret managers.

---

**Q21. What is the service/controller/routes architecture pattern and what are the responsibilities of each layer?**

This is a three-layer separation of concerns pattern:

| Layer | Responsibility |
|-------|----------------|
| **Routes** | Define URL paths and HTTP methods; map them to controller functions; apply route-level middleware. |
| **Controllers** | Parse request inputs (params, body, query); call service methods; format and send the HTTP response. They know about `req` and `res` but NOT about the database. |
| **Services** | Contain all business logic and data access. They are framework-agnostic — no `req`/`res` — so they can be unit-tested independently of Express. |

Benefits: logic is easier to test, routes stay thin, and the same service can be reused by different controllers (REST, GraphQL, CLI).
