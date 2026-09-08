import { createApp } from './app';
import { ENV } from './config/env';
import { db } from './database/db';

const app = createApp();

const server = app.listen(ENV.PORT, () => {
  console.log(`==================================================`);
  console.log(`🛡️  AEGISALERT EMERGENCY BACKEND API SERVER RUNNING`);
  console.log(`📡 URL: http://localhost:${ENV.PORT}/api`);
  console.log(`🏥 Health: http://localhost:${ENV.PORT}/api/health`);
  console.log(`⚙️  Environment: ${ENV.NODE_ENV}`);
  console.log(`==================================================`);
});

// Graceful shutdown handling
process.on('SIGINT', async () => {
  console.log('\n[SERVER] Gracefully shutting down...');
  server.close(async () => {
    await db.close();
    console.log('[SERVER] Database and server closed. Exiting.');
    process.exit(0);
  });
});

process.on('SIGTERM', async () => {
  console.log('\n[SERVER] Received SIGTERM...');
  server.close(async () => {
    await db.close();
    process.exit(0);
  });
});
