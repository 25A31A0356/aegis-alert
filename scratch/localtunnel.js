const localtunnel = require('localtunnel');

(async () => {
  try {
    const tunnel = await localtunnel({ port: 5173 });
    console.log(`LOCALTUNNEL_URL: ${tunnel.url}`);
    tunnel.on('close', () => {
      console.log('Tunnel closed');
    });
  } catch (err) {
    console.error('Localtunnel error:', err);
  }
})();
