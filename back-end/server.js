const express = require('express');
const connectDB = require('./db');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(express.json());
app.use(cors());

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const authRoutes = require('./routes/auth');

app.use('/api/user', authRoutes);

const bikeRoutes = require('./routes/user-routes');

app.use('/api/routes', bikeRoutes);
