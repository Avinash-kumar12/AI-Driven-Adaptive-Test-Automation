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
npm test