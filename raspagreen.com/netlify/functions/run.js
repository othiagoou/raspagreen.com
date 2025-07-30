const API_BASE_URL = "https://raspagreen-backend-plv5.onrender.com";

exports.handler = async (event, context) => {
  // Tratamento do preflight CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
      },
      body: ''
    };
  }

  const method = event.httpMethod;
  const path = event.rawUrl.replace(event.headers.origin, '').replace(/\/.netlify\/functions\/run/, '');

  // Monta a URL final da API que será chamada
  const url = `${API_BASE_URL}${path}`;

  // Constrói headers (com JWT incluso)
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.JWT_TOKEN}`,
  };

  // Prepara o body se for POST ou PUT
  let body = undefined;
  if (['POST', 'PUT'].includes(method) && event.body) {
    body = event.body;
  }

  try {
    const response = await fetch(url, {
      method,
      headers,
      body,
    });

    const responseData = await response.json();

    return {
      statusCode: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(responseData),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: false,
        error: 'Erro ao conectar com a API',
        detail: error.message,
      }),
    };
  }
};