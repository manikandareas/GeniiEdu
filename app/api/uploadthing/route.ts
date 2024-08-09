import { createRouteHandler } from 'uploadthing/next';

import { ourFileRouter } from '@/app/_libs/uploadthing';

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
    router: ourFileRouter,
    // Apply an (optional) custom config:
    // config: { ... },
});
