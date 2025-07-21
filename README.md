
# Monolithic

A Fullstack manga reading website, full with features. A Successor to [alterkai-website](https://github.com/Alterkai/alterkai-website), hence why it's called Alterkai v2 (Codename: Monolithic). Powered by Nuxt 3, PostgreSQL, and Redis.

## Development

Clone the project

```bash
  git clone https://github.com/Alterkai/monolithic.git
```

Go to the project directory

```bash
  cd monolithic
```

Install dependencies

```bash
  npm install
```

Install [Redis v7.0](https://redis.io/downloads/). This code uses Redis v7.0.5.

Install [Postgres v16](https://www.postgresql.org/download/). Make sure to install the same version, as different version is untested and may broke the Website.

Configure .env (or copy from .env.example)
```env
DB_USER = 
DB_PASSWORD = 
DB_HOST = 
DP_PORT = 
DB_NAME = 

JWT_SECRET =

AZURE_STORAGE_CONNECTION_STRING =
AZURE_STORAGE_CONTAINER_NAME =
CDN_URL =

REDIS_HOST =
REDIS_PORT =
REDIS_PASSWORD =
REDIS_DB =
```

Start the server

```bash
  npm run dev
```
## Features

### v1.0
- Auth using JWT Token (Staff and Regular member)
- CRUD Manga (and genres)
- CRUD Chapters
- Bookmarks (Only for logged in Users)
- Last read tracking (localStorage)
- Azure Blob Storage as CDN/Image storage
- Manga and Chapter view trackers using Redis + PgSQL
- Daily Highlights for home (random title, reset daily)
- Comments (Basics)

### Yet to be implemented
- Switching image CDN [Soon]
- Local History (UI Implementation of Lastread) [Soon]
- Tasks Assignment for Scanlation Staff [Soon]
- Salary Tracking for Scanlation Staff [Soon]
- Popularity Algorithm [Soon]
- SQL seeds [Soon]

## Authors

- [@faralha](https://www.github.com/faralha)

