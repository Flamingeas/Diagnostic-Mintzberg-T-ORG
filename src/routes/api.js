const express = require('express');
const router = express.Router();
const { db, insertResponse } = require('../db');

const VALID_CONFIGS = ['SE', 'BM', 'BP', 'DO', 'AD', 'MI'];

router.post('/submit', (req, res) => {
  const { company_name, company_size, answers, scores, winner, runner_up, gap } = req.body;

  if (!company_name || !answers || !scores || !winner) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }
  if (!VALID_CONFIGS.includes(winner)) {
    return res.status(400).json({ error: 'Invalid winner.' });
  }
  if (runner_up && !VALID_CONFIGS.includes(runner_up)) {
    return res.status(400).json({ error: 'Invalid runner_up.' });
  }

  let result;
  try {
    result = insertResponse.run({
      company_name,
      company_size: company_size ?? null,
      q1:  answers.q1  ?? null,
      q2:  answers.q2  ?? null,
      q3:  answers.q3  ?? null,
      q4:  answers.q4  ?? null,
      q5:  answers.q5  ?? null,
      q6:  answers.q6  ?? null,
      q7:  answers.q7  ?? null,
      q8:  answers.q8  ?? null,
      q9:  answers.q9  ?? null,
      q10: answers.q10 ?? null,
      q11: answers.q11 ?? null,
      score_SE: scores.SE ?? 0,
      score_BM: scores.BM ?? 0,
      score_BP: scores.BP ?? 0,
      score_DO: scores.DO ?? 0,
      score_AD: scores.AD ?? 0,
      score_MI: scores.MI ?? 0,
      winner,
      runner_up: runner_up ?? null,
      gap: gap ?? null,
    });
  } catch (err) {
    console.error(`[submit] DB insert failed for "${company_name}":`, err.message);
    return res.status(500).json({ error: 'Échec de l\'enregistrement en base de données.' });
  }

  if (!result || !result.lastInsertRowid) {
    console.error(`[submit] Insert returned no row id for "${company_name}"`);
    return res.status(500).json({ error: 'L\'enregistrement n\'a pas pu être confirmé.' });
  }

  res.json({ ok: true, id: result.lastInsertRowid });
});

function basicAuth(req, res, next) {
  const header = req.headers['authorization'];
  if (!header || !header.startsWith('Basic ')) {
    res.set('WWW-Authenticate', 'Basic realm="Résultats Mintzberg"');
    return res.status(401).send('Accès restreint.');
  }
  const [user, pass] = Buffer.from(header.slice(6), 'base64').toString().split(':');
  const RESULTS_USER = process.env.RESULTS_USER || 'admin';
  const RESULTS_PASS = process.env.RESULTS_PASS || 'mintzberg';
  if (user === RESULTS_USER && pass === RESULTS_PASS) return next();
  res.set('WWW-Authenticate', 'Basic realm="Résultats Mintzberg"');
  return res.status(401).send('Identifiants incorrects.');
}

router.get('/results', basicAuth, (req, res) => {
  res.redirect('/results.html');
});

router.get('/results/data', basicAuth, (req, res) => {
  const rows = db.prepare(`
    SELECT * FROM responses ORDER BY company_name, submitted_at DESC
  `).all();

  const grouped = {};
  for (const row of rows) {
    if (!grouped[row.company_name]) grouped[row.company_name] = [];
    grouped[row.company_name].push(row);
  }
  res.json(grouped);
});

router.get('/results/:company', basicAuth, (req, res) => {
  const rows = db.prepare(`
    SELECT * FROM responses WHERE company_name = ? ORDER BY submitted_at DESC
  `).all(req.params.company);
  res.json(rows);
});

module.exports = router;
