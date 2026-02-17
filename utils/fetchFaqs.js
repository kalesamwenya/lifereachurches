// Fetch all FAQs from the PHP API
export async function fetchFaqs() {
  const res = await fetch('/lrcadmin/api/faq/get_all.php');
  if (!res.ok) throw new Error('Failed to fetch FAQs');
  return await res.json();
}

// Store a new FAQ
export async function storeFaq(question, answer) {
  const res = await fetch('/lrcadmin/api/faq/store.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, answer })
  });
  if (!res.ok) throw new Error('Failed to store FAQ');
  return await res.json();
}
