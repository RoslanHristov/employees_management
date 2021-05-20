const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const db = require('./config/database');

// Test DB
db.authenticate()
  .then(() => console.log('Database connected!'))
  .catch(err => console.log('Error: ' + err))

const app = express();
// Handlebars
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true }));

// Index route
app.get('/', (req, res) => res.render('index', { layout: 'landing' }));

// Employee routes
app.use('/employees', require('./routes/employees'));

// Comments routes
app.use('/comments', require('./routes/comments'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));