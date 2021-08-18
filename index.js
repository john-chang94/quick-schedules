require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const expressValidator = require('express-validator');

app.use(expressValidator());
app.use(cors());
app.use(express.json());

app.use('/', require('./routes/roleRoutes'));
app.use('/', require('./routes/authRoutes'));
app.use('/', require('./routes/userRoutes'));
app.use('/', require('./routes/presetRoutes'));
app.use('/', require('./routes/shiftRoutes'));
app.use('/', require('./routes/requestRoutes'));
app.use('/', require('./routes/storeRoutes'));

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client/build')));
    
    const path = require('path');
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    })
}
// app.use(express.static(path.join(__dirname, 'build')));

// app.get('*', function (req, res) {
//  res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));