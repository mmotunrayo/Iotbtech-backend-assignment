# IoTBTech Backend Assignment

A Node.js / Express / TypeScript backend assignment covering theory questions and a structured mini-project.

## Project Structure

``` text
iobtech-backend-assignment/
├── THEORY.md
├── README.md
└── mini-project/
    ├── package.json
    ├── tsconfig.json
    ├── .gitignore
    ├── scripts/
    │   ├── generate.ts
    │   └── aggregate.ts
    ├── data/
    └── src/
        ├── index.ts
        ├── middleware/
        │   ├── requestLogger.ts
        │   ├── requireApiKey.ts
        │   ├── notFoundHandler.ts
        │   └── errorHandler.ts
        ├── routes/
        │   └── product.routes.ts
        ├── controllers/
        │   └── product.controller.ts
        ├── services/
        │   └── product.service.ts
        └── utils/
            └── logger.ts ```
           


## Setup

```bash
npm install
cp .env.example .env
# Edit .env with your values
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Run server in development mode |
| `npm run build` | Compile TypeScript |
| `npm start` | Run compiled server |
| `npm run generate` | Generate sample CSV data |
| `npm run aggregate` | Stream-aggregate the CSV |

## Phase A — CSV Pipeline

### Generate CSV

```bash
npm run generate
```

Writes `src/phase-a/data/sensor_readings.csv` with 1,000 simulated sensor rows.

### Aggregate CSV

```bash
npm run aggregate
```

Streams the CSV and prints per-sensor statistics (count, min, max, average).

## Phase B — REST API

Base URL: `http://localhost:3000/api`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/readings` | List all readings (pagination supported) |
| GET | `/api/readings/:id` | Get a single reading |
| POST | `/api/readings` | Create a new reading |
| DELETE | `/api/readings/:id` | Delete a reading |
| GET | `/api/stats` | Aggregated statistics |

## Phase C — Middleware

- **requestLogger** — logs method, URL, status, and response time via Winston
- **requireApiKey** — validates `x-api-key` header against `API_KEY` env var
- **notFoundHandler** — returns 404 JSON for unknown routes
- **errorHandler** — global error handler, returns structured JSON errors
