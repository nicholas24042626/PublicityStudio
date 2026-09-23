# Schedule website → Publicity Studio

Give this folder to the schedule website developer. The integration is server-to-server so no OpenAI key or integration secret is exposed in browser code.

## Required environment variables on the schedule website

```text
POSTER_SERVICE_URL=https://your-publicity-studio.onrender.com
POSTER_INTEGRATION_SECRET=the same value as SCHEDULE_INTEGRATION_SECRET on Publicity Studio
```

## Schedule payload

```json
{
  "id": "schedule-123",
  "title": "Healthy Ageing Workshop",
  "description": "Learn practical ways to stay active and connected.",
  "date": "2026-10-24",
  "start_time": "09:30",
  "end_time": "11:00",
  "venue": "SEEN Activity Room",
  "audience": "Seniors aged 60 and above",
  "registration": "Register with the programme team by 20 October.",
  "slots": 30,
  "category": "Wellness"
}
```

`title`, `date`, and `venue` are required. Dates use `YYYY-MM-DD`; times use 24-hour `HH:MM`.

## Button flow

1. The logged-in staff member saves a schedule.
2. The schedule website's backend calls `POST /api/create-poster-link`.
3. It sends `Authorization: Bearer POSTER_INTEGRATION_SECRET` and the schedule JSON.
4. Publicity Studio returns a signed URL valid for 15 minutes.
5. Redirect the staff member to that URL.
6. Publicity Studio imports the details and, when `auto_generate` is true, generates suitable artwork and opens the finished poster editor.

Use [poster-link.js](poster-link.js) for a Node/JavaScript backend or [poster_link.py](poster_link.py) for Python.

## Important security rule

Do not call `/api/create-poster-link` from frontend/browser JavaScript. The integration secret belongs only in the schedule website's server environment.
