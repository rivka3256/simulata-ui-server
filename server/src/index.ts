import 'dotenv/config';
import app from './app.js';
import { connect, disconnect } from './rabbitmq/index.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  connect();
});

process.on('SIGINT', async () => { await disconnect(); process.exit(0); });
process.on('SIGTERM', async () => { await disconnect(); process.exit(0); });
