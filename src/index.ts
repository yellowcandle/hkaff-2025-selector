import { Router } from 'itty-router';

interface Env {
  ASSETS: {
    fetch: (req: Request) => Promise<Response>;
  };
  KV?: any;
  ENVIRONMENT?: string;
}

const router = Router();

router.all('*', async (req: Request, env: Env) => {
  try {
    const url = new URL(req.url);
    const pathname = url.pathname;

    console.log(`[${new Date().toISOString()}] ${req.method} ${pathname}`);

    if (pathname === '/api/health') {
      return new Response(
        JSON.stringify({
          status: 'ok',
          timestamp: new Date().toISOString(),
          environment: env.ENVIRONMENT || 'production',
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'max-age=60',
          },
        }
      );
    }

    if (pathname.startsWith('/api/')) {
      return new Response(
        JSON.stringify({
          error: 'API endpoint not found',
          path: pathname,
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const response = await env.ASSETS.fetch(req);

    if (!response.ok && response.status === 404) {
      const indexResponse = await env.ASSETS.fetch(
        new Request(new URL('/index.html', req.url))
      );

      if (indexResponse.ok) {
        const newResponse = new Response(indexResponse.body, indexResponse);
        newResponse.headers.set('Cache-Control', 'no-cache');
        return newResponse;
      }
    }

    const newResponse = new Response(response.body, response);
    const cacheControl = pathname === '/' || pathname.endsWith('.html')
      ? 'no-cache'
      : pathname.match(/\.(js|css|woff2|png|jpg|jpeg|svg|ico)$/)
      ? 'public, max-age=31536000, immutable'
      : 'public, max-age=3600';

    newResponse.headers.set('Cache-Control', cacheControl);

    return newResponse;
  } catch (err) {
    console.error('Worker error:', err);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: err instanceof Error ? err.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
});

export default router;
