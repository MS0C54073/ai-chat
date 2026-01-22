## AI Chat (Next.js + Bun + SQLite)

### Setup

- Install dependencies: `bun install`
- Add a sample workbook:
  - `mkdir data`
  - place `example.xlsx` at `./data/example.xlsx`
- Set your API key: `OPENAI_API_KEY=...`

### Bun Commands

- `bun dev` run the dev server
- `bun run build` build for production
- `bun start` start the production server
- `bun lint` lint

### DB Initialization

- SQLite initializes automatically on first request.
- Default DB path: `./data/app.db` (override with `SQLITE_PATH`).

### XLSX Location

- The XLSX tools read/write `./data/example.xlsx`.
- The app will error if the file is missing.

### Limitations

- No auth or multi-user isolation.
- XLSX updates are direct file writes (single-writer expected).
- Table modal uses sample data (wire to real XLSX preview as needed).

### Notes

- App runs on Next.js App Router with Bun SQLite.
