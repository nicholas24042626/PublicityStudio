/**
 * SERVER-SIDE example for your friend's scheduling website.
 * Never run this code in browser JavaScript because it uses the integration secret.
 */
export async function createPosterLink(schedule) {
  const response = await fetch(`${process.env.POSTER_SERVICE_URL}/api/create-poster-link`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.POSTER_INTEGRATION_SECRET}`
    },
    body: JSON.stringify({ schedule, auto_generate: true })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Could not create poster link');
  return data.url;
}

// In the schedule website's authenticated button handler:
// const posterUrl = await createPosterLink(savedSchedule);
// response.redirect(posterUrl);
