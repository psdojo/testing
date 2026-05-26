URL Monitor

Simple TypeScript backend that processes URL monitoring jobs using Express, BullMQ, and Redis.

It accepts URL jobs via an API endpoint, pushes them into a Redis-backed queue, and processes them asynchronously using a worker.

The worker performs an uptime check by sending an HTTP request to the provided URL, measuring response time, and returning status results.

Tech stack:
Node.js, TypeScript, Express, BullMQ, Redis, Axios

Architecture:
Client → Express API → Redis Queue → Worker → HTTP Request → Result

Setup steps:

1. Install dependencies:
npm install express bullmq axios ioredis
npm install -D typescript ts-node @types/node @types/express

2. Start Redis using Docker:
docker run -d -p 6379:6379 redis:7

3. Run the application:
npx ts-node src/app3.ts

API:

POST /job

Request body:
{
  "url": "https://example.com",
  "type": "uptime"
}

How it works:
1. Client sends URL to API
2. API pushes job into Redis queue
3. Worker picks job from queue
4. URL is validated
5. HTTP request is executed
6. Status and latency are returned

Current features:
- URL job submission API
- Redis-backed queue system
- Async worker pipeline
- Basic URL validation
- Uptime monitoring

Limitations:
- No database storage for results
- No UI/dashboard
- No alerts or notifications
- Single worker type only

Future improvements:
- Persist results in database
- Add redirect checker module
- Add Lighthouse performance checks
- Add alerting system (email/webhook)
- Add monitoring dashboard
