// Netlify Function: confirm-order.js
// Odbiera webhook z Netlify Forms (formularz "zlecenie")
// Dodaje klienta do MailerLite → automation wysyła e-mail potwierdzający

exports.handler = async (event) => {
  // Akceptujemy tylko POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Netlify wysyła payload jako JSON
    const payload = JSON.parse(event.body || '{}');
    const data = payload.data || {};

    const email  = data.email   || '';
    const usluga = data.usluga  || 'oklejanie';
    const auto   = data.auto    || '';
    const miasto = data.miasto  || '';

    // Brak maila = nic nie robimy (np. test bez danych)
    if (!email || !email.includes('@')) {
      return { statusCode: 200, body: 'no valid email' };
    }

    const ML_API_KEY  = process.env.MAILERLITE_API_KEY;
    const ML_GROUP_ID = process.env.MAILERLITE_GROUP_ID;

    if (!ML_API_KEY) {
      console.error('Brak MAILERLITE_API_KEY w env');
      return { statusCode: 500, body: 'config error' };
    }

    // Dodaj subskrybenta do MailerLite
    const body = {
      email,
      fields: {
        usluga,
        auto,
        miasto,
      },
      status: 'active',  // od razu aktywny (wyraził zgodę w formularzu)
    };

    // Jeśli mamy ID grupy — przypisz do niej
    if (ML_GROUP_ID) {
      body.groups = [ML_GROUP_ID];
    }

    const mlRes = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ML_API_KEY}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const mlData = await mlRes.json();

    if (!mlRes.ok) {
      // Duplikat (422) = subskrybent już istnieje → OK, nie traktuj jako błąd
      if (mlRes.status === 422) {
        console.log('Subscriber already exists:', email);
        return { statusCode: 200, body: 'already subscribed' };
      }
      console.error('MailerLite error:', mlRes.status, JSON.stringify(mlData));
      return { statusCode: 500, body: 'mailerlite error' };
    }

    console.log('Subscriber added:', email, '→ MailerLite ID:', mlData?.data?.id);
    return { statusCode: 200, body: 'ok' };

  } catch (err) {
    console.error('Function error:', err.message);
    return { statusCode: 500, body: 'internal error' };
  }
};
