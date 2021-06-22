require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.use('/', require('./routes/roleRoutes'));
app.use('/', require('./routes/authRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));