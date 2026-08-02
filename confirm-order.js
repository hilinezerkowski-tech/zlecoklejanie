// Netlify Function: confirm-order.js
// Odbiera webhook z Netlify Forms (formularz "zlecenie")
// Dodaje klienta do MailerLite → automation wysyła e-mail potwierdzający

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const payload = JSON.parse(event.body || '{}');
    const data = payload.data || {};

    const email  = data.email   || '';
    const usluga = data.usluga  || 'oklejanie';
    const auto   = data.auto    || '';
    const miasto = data.miasto  || '';

    if (!email || !email.includes('@')) {
      return { statusCode: 200, body: 'no valid email' };
    }

    const ML_API_KEY  = process.env.MAILERLITE_API_KEY;
    const ML_GROUP_ID = process.env.MAILERLITE_GROUP_ID;

    if (!ML_API_KEY) {
      console.error('Brak MAILERLITE_API_KEY w env');
      return { statusCode: 500, body: 'config error' };
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ML_API_KEY}`,
      'Accept': 'application/json',
    };

    // KROK 1: Upsert subskrybenta (tworzy nowego lub aktualizuje istniejącego)
    const upsertRes = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        email,
        fields: { usluga, auto, miasto },
        status: 'active',
      }),
    });

    let subscriberId = null;

    if (upsertRes.ok) {
      // Nowy subskrybent — pobierz ID
      const upsertData = await upsertRes.json();
      subscriberId = upsertData?.data?.id;
      console.log('New subscriber:', email, '→ ID:', subscriberId);
    } else if (upsertRes.status === 422) {
      // Subskrybent już istnieje — pobierz jego ID
      console.log('Subscriber exists, fetching ID for:', email);
      const getRes = await fetch(
        `https://connect.mailerlite.com/api/subscribers/${encodeURIComponent(email)}`,
        { method: 'GET', headers }
      );
      if (getRes.ok) {
        const getData = await getRes.json();
        subscriberId = getData?.data?.id;
        console.log('Existing subscriber ID:', subscriberId);
      }
    }

    // KROK 2: Dodaj do grupy ZlecOklejanie (trigger automation)
    if (subscriberId && ML_GROUP_ID) {
      const groupRes = await fetch(
        `https://connect.mailerlite.com/api/subscribers/${subscriberId}/groups/${ML_GROUP_ID}`,
        { method: 'POST', headers }
      );
      if (groupRes.ok) {
        console.log('Added to group:', ML_GROUP_ID);
      } else {
        const groupErr = await groupRes.text();
        console.warn('Group add failed:', groupRes.status, groupErr);
      }
    }

    return { statusCode: 200, body: 'ok' };

  } catch (err) {
    console.error('Function error:', err.message);
    return { statusCode: 500, body: 'internal error' };
  }
};
