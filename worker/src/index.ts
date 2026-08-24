const jsonHeaders = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
  'x-content-type-options': 'nosniff',
} as const;

function jsonResponse(body: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      ...jsonHeaders,
      ...init.headers,
    },
  });
}

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === 'GET' && url.pathname === '/api/health') {
      return jsonResponse({
        status: 'ok',
        phase: '0.5',
        realDataConnected: false,
        operationalUseApproved: false,
      });
    }

    return jsonResponse(
      {
        error: {
          code: 'NOT_FOUND',
          message: 'API route not found',
        },
      },
      { status: 404 },
    );
  },
} satisfies ExportedHandler;
