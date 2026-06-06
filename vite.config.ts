import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { Buffer } from 'buffer'

// Simple Vite plugin to execute Vercel API routes locally
const vercelApiPlugin = () => ({
  name: 'vercel-api-plugin',
  configureServer(server: any) {
    server.middlewares.use(async (req: any, res: any, next: any) => {
      if (req.url && req.url.startsWith('/api/')) {
        try {
          const urlPath = req.url.split('?')[0];
          const modulePath = `.${urlPath}.ts`;
          
          let module;
          try {
             module = await server.ssrLoadModule(modulePath);
          } catch (e) {
             return next();
          }
          
          const handler = module.default;
          if (handler) {
            res.status = (code: number) => {
              res.statusCode = code;
              return res;
            };
            res.json = (data: any) => {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
            };
            res.send = (text: string) => {
              res.setHeader('Content-Type', 'text/plain');
              res.end(text);
            };

            if (req.method === 'POST' || req.method === 'PUT') {
              const buffers: Buffer[] = [];
              for await (const chunk of req) {
                buffers.push(chunk);
              }
              const bodyStr = Buffer.concat(buffers).toString();
              if (bodyStr) {
                try {
                  req.body = JSON.parse(bodyStr);
                } catch(e) {
                  req.body = bodyStr;
                }
              }
            }

            await handler(req, res);
            return;
          }
        } catch (e) {
          console.error('API Error:', e);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Internal Server Error' }));
          return;
        }
      }
      next();
    });
  }
})

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  Object.assign(process.env, env);

  return {
    plugins: [react(), vercelApiPlugin()],
  };
})
