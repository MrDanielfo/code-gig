const express = require('express');
const bodyParser = require('body-parser');
const postgres = require('pg');
const handlebars = require('express-handlebars'); 
const path = require('path'); 

const db = require('./config/database'); 


// TestDb
db.authenticate()
   .then(() => {
       console.log('Database Authenticated')
   })
   .catch(err => {
       console.log(err)
   })

// Llamar la ruta 

const gigs = require('./routes/gigs')

const app = express(); 

app.engine('handlebars', handlebars({
    defaultLayout: 'main'
}));

app.set('view engine', 'handlebars');

// parse application/x-www-form-urlencoded and json 
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
// Static Folder 
app.use(express.static(path.join(__dirname, 'public'))); 


app.get('/', (req, res) => {
    res.render('index', { layout : 'landing'})
})


app.use('/gigs', gigs)

const PORT = process.env.PORT || 5500;

app.listen(PORT, () => console.log(`Server started in http://localhost:${PORT}`)); 



