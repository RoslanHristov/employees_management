const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const db = require('./config/database');

/**
 * Initialize database
 */
db.authenticate()
  .then(() => console.log('Database connected!'))
  .catch(err => console.log('Error: ' + err))

const app = express();

/**
 * Add handlebars template engine for server side rendering
 */
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

/**
 * Set static folder
 */ 
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Express parsing
 */
app.use(express.json()) 
app.use(express.urlencoded({ extended: true }));

/**
 * Index route
 */
app.get('/', (req, res) => res.render('index', { layout: 'landing' }));

/**
 * Router for employees resource
 */
app.use('/employees', require('./routes/employees'));

/**
 * Router for comments resource
 */
app.use('/comments', require('./routes/comments'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));