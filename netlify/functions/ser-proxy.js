exports.handler = async function(event) {
  var raw = event.headers['authorization'] || event.headers['Authorization'] || '';
  if (!raw) return { statusCode: 401, body: JSON.stringify({ error: 'Missing API key' }) };
  var key = raw.replace(/^(Token|Bearer)\s+/i, '').trim();
  var path = event.path.replace('/.netlify/functions/ser-proxy', '').replace('/api/ser', '') || '/sites';
  if (!path.startsWith('/v1/')) path = '/v1' + path;
  var qs = event.rawQuery ? '?' + event.rawQuery : '';
  var url = 'https://api.seranking.com' + path + qs;
  try {
    var r = await fetch(url, {
      method: event.httpMethod,
      headers: { 'Authorization': 'Token ' + key, 'Content-Type': 'application/json' },
      body: event.httpMethod === 'POST' ? event.body : undefined
    });
    var data = await r.text();
    return { statusCode: r.status, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }, body: data };
  } catch(err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};