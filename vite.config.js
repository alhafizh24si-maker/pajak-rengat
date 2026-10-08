import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import chatHandler from './api/chat.js';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  if (!process.env.GEMINI_API_KEY) {
    process.env.GEMINI_API_KEY = env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || '';
  }
  if (!process.env.VITE_GEMINI_API_KEY) {
    process.env.VITE_GEMINI_API_KEY = env.VITE_GEMINI_API_KEY || '';
  }

  return {
    plugins: [
      react(),
      {
        name: 'api-chat-dev-middleware',
        configureServer(server) {
          server.middlewares.use('/api/chat', (req, res) => {
            if (req.method === 'OPTIONS') {
              res.setHeader('Access-Control-Allow-Origin', '*');
              res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
              res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
              res.statusCode = 200;
              res.end();
              return;
            }

            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Method Not Allowed' }));
              return;
            }

            let body = '';
            req.on('data', (chunk) => {
              body += chunk;
            });
            req.on('end', async () => {
              const fakeRes = {
                setHeader: (k, v) => {
                  try {
                    res.setHeader(k, v);
                  } catch {}
                },
                status: (code) => {
                  res.statusCode = code;
                  return fakeRes;
                },
                json: (data) => {
                  try {
                    if (!res.headersSent) res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(data));
                  } catch {}
                  return fakeRes;
                },
                end: (data) => {
                  res.end(data);
                  return fakeRes;
                },
              };

              try {
                const parsedBody = body ? JSON.parse(body) : {};
                const fakeReq = {
                  method: 'POST',
                  body: parsedBody,
                };
                await chatHandler(fakeReq, fakeRes);
              } catch (err) {
                console.error('[DEV API /chat Error]:', err);
                fakeRes.status(200).json({
                  answer: 'Halo! Asisten AI KPP Pratama Rengat siap membantu Anda seputar perpajakan.',
                });
              }
            });
          });
        },
      },
    ],
  };
});
