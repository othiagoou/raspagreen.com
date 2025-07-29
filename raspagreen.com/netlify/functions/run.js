exports.handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      },
      body: ''
    }
  }

  // Accept both GET and POST methods
  if (event.httpMethod === 'GET' || event.httpMethod === 'POST') {
    let requestData = null
    
    // Parse POST body if present
    if (event.httpMethod === 'POST' && event.body) {
      try {
        requestData = JSON.parse(event.body)
      } catch (e) {
        requestData = event.body
      }
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      },
      body: JSON.stringify({
        success: true,
        message: 'Run endpoint disponível',
        data: {
          status: 'ok',
          timestamp: new Date().toISOString(),
          method: event.httpMethod,
          deployed: true,
          requestData: requestData,
          fixed: 'Now accepts both GET and POST'
        }
      })
    }
  }

  // Method not allowed
  return {
    statusCode: 405,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      success: false,
      error: 'Method not allowed',
      allowedMethods: ['GET', 'POST', 'OPTIONS']
    })
  }
}