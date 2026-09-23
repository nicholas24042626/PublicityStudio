"""Server-side helper for a Python scheduling website."""
import json
import os
import urllib.request


def create_poster_link(schedule):
    request = urllib.request.Request(
        os.environ["POSTER_SERVICE_URL"].rstrip("/") + "/api/create-poster-link",
        data=json.dumps({"schedule": schedule, "auto_generate": True}).encode("utf-8"),
        method="POST",
        headers={
            "Content-Type": "application/json",
            "Authorization": "Bearer " + os.environ["POSTER_INTEGRATION_SECRET"],
        },
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        return json.loads(response.read().decode("utf-8"))["url"]


# Flask example:
# return redirect(create_poster_link(saved_schedule))
