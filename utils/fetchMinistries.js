// Fetches three ministries from the PHP endpoint
export async function fetchMinistries() {
  const res = await fetch('https://content.lifereachchurch.org/ministries/get_all.php?type=ministry&sortKey=name&sortDir=asc');
  if (!res.ok) throw new Error('Failed to fetch ministries');
  const data = await res.json();
  // Return only the first three
  return Array.isArray(data) ? data.slice(0, 3) : [];
}
