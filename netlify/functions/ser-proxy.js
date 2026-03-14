exports.handler = async function(event) {
    const apiKey = event.headers['authorization'] || event.headers['Authorization'];
    if (!apiKey) return { statusCode: 401, body: JSON.stringify({ error: 'Missing API key' }) };
    const path = event.path.replace('/.netlify/functions/ser-proxy', '').replace('/api/ser', '') || '/sites';
    const qs = event.rawQuery ? '?' + event.rawQuery : '';
    const url = 'https://api.seranking.com' + path + qs;
    try {
          const response = await fetch(url, {
                  method: event.httpMethod,
                  headers: { 'Authorization': apiKey, 'Content-Type': 'application/json' },
                  body: event.httpMethod === 'POST' ? event.body : undefined
          });
          const data = await response.text();
          return {
                  statusCode: response.status,
                  headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                  body: data
          };
    } catch(err) {
          return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
    }
};
