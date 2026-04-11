const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3001;
const RESULTS_USER = process.env.RESULTS_USER || 'admin';
const RESULTS_PASS = process.env.RESULTS_PASS || 'mintzberg';

const apiRoutes = require('./src/routes/api');

function basicAuth(req, res, next) {
  const header = req.headers['authorization'];
  if (!header || !header.startsWith('Basic ')) {
    res.set('WWW-Authenticate', 'Basic realm="Résultats Mintzberg"');
    return res.status(401).send('Accès restreint.');
  }
  const [user, pass] = Buffer.from(header.slice(6), 'base64').toString().split(':');
  if (user === RESULTS_USER && pass === RESULTS_PASS) return next();
  res.set('WWW-Authenticate', 'Basic realm="Résultats Mintzberg"');
  return res.status(401).send('Identifiants incorrects.');
}

app.use(express.json());

// fichiers publiques sauf results.html
app.use(express.static(path.join(__dirname, 'public'), {
  index: false,
}));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/index.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/results.html', basicAuth, (req, res) => res.sendFile(path.join(__dirname, 'public', 'results.html')));

app.use('/api', apiRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
