require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.use('/', require('./routes/roleRoutes'));
app.use('/', require('./routes/authRoutes'));
app.use('/', require('./routes/userRoutes'));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build/index.html'));
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));