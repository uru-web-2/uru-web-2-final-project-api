# uru-web-2-final-project-api

Express and PostgreSQL API for the Web 2 final project at Universidad Rafael Urdaneta: a library system with users, profiles and permissions, and a catalog of books, articles, magazines and theses.

**Note:** This repository is archived and read-only, and it is coursework. The original description asks not to take it seriously: the authors disagreed with the concept but had to handle the given problem this way.

## How it works

Instead of one route per resource, the API exposes a few POST endpoints and dispatches the work by name.

- **Auth** — `/signup`, `/login`, `/logout`, `/send-email-verification`, `/verify-email`, `/forgot-password` and `/reset-password`. Sessions use `express-session`; passwords are hashed with bcrypt; emails are sent through MailerSend.
- **`/execute`** — requires a session and runs a service method selected by the request body, after Joi validation and a module permission check. In production an audit step runs after it. Multipart requests (a file plus images) are accepted.
- **Static files** — the `public/` folder is served as-is.

## Project structure

- **`index.js`** — loads the environment and starts the dispatcher.
- **`migrate.js`** — creates tables, functions, stored procedures and seed data.
- **`src/components/`** — dispatcher, session, security, database, logger, audit, mail and file helpers.
- **`src/router/`** — one folder per area (`Library`, `Security`, `Other`). Each entity has a controller, `Model`, `Service` and `Validator` file.
- **`src/database/model/`** — table definitions (users, people, profiles, permissions, documents, books, locations, topics, languages and more), constraints, functions and stored procedures.

The code depends on the author's `@ralvarezdev/js-*` packages. The matching client is [`uru-web-2-final-project-api-wrapper`](https://github.com/uru-web-2/uru-web-2-final-project-api-wrapper), and the project frontend is [`uru-web-2-final-project-frontend`](https://github.com/uru-web-2/uru-web-2-final-project-frontend), whose dev proxy forwards `/api` to a local backend.

## Usage

```
npm install
cp example.env .env   # fill in the values
npm run migrate       # create the schema
npm run dev           # or: npm run prod, npm run debug
```

## Configuration

Environment variables are listed in `example.env` and all start with `URU_WEB_2_FINAL_PROJECT_`: API port and secret, session settings, PostgreSQL user, password, database, host and pool size, email verification and password reset token durations and URLs, MailerSend domain and API key, and bcrypt salt rounds.

## License

GNU General Public License v3.0. `package.json` declares `ISC`, which does not match the `LICENSE` file.
