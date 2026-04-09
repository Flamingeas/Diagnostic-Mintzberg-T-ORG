const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3001;

const apiRoutes = require('./src/routes/api');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', apiRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
