export const getUpcomingEvents = (events) => {
  const now = new Date();
  return events
    .filter(e => e.ministry_id === null && new Date(e.start_time) >= now)
    .sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
};