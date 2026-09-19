# AI-Driven Adaptive Test Automation Framework

Major Project

## Team Members
- Member 1
- Member 2
- Member 3

## Modules
- Test Automation
- AI/ML
- Backend
- Frontend

## Healenium Setup

The automation framework requires a running Healenium proxy at:

http://localhost:8085

Before running the test suite, start the required Healenium services and make sure the proxy is accessible on port 8085.

The Healenium proxy URL can be changed using the `HEALENIUM_URL` environment variable.

Example:

```powershell
$env:HEALENIUM_URL="http://localhost:8085"
npm --prefix automation test
```


The healing-score resolver also requires the Healenium PostgreSQL database to be accessible using the following environment variables:

- `HEALENIUM_DB_HOST`
- `HEALENIUM_DB_PORT`
- `HEALENIUM_DB_USER`
- `HEALENIUM_DB_PASSWORD`
- `HEALENIUM_DB_NAME`

The default database host is `localhost`, port is `5432`, user is `healenium_user`, and database is `healenium`.
