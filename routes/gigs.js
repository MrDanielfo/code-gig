const express = require('express');

const router = express.Router();

const db = require('../config/database');

const Gig = require('../models/Gig'); 

const Sequelize = require('sequelize'); 

const Op = Sequelize.Op; 


// Get Gigs

router.get('/', (req, res) => {
    Gig.findAll({
        order : [
            ['createdAt', 'DESC']
        ]
    })
    .then(gigs => {
        //console.log(gigs)
        res.render('gigs', {
            gigs 
        })
    })
    .catch(err => console.log(err))
});

// Page for adding a Gig

router.get('/add', (req, res) => {
    res.render('add')
})

// Add a gig

router.post('/add', (req, res) => {

let errors = [];

// Ver tercer video de Brad Sequelize Node, para ver la destructuración, la cual ahorra la escritura de código 

let title = req.body.title
let technologies = req.body.technologies
let description = req.body.description
let budget = req.body.budget
let contactEmail = req.body.contact_email

if(!title || title == '') {
    errors.push({text : "You must provide a title for the gig"})
} 

if(!technologies || technologies == '') {
    errors.push({ text: "You must provide the technologies required" })
}

if(!description || description == '') {
    errors.push({ text: 'You must provide the description for the gig' })
}

if(!budget || budget == '') {
    errors.push({ text: 'You must provide the budget for the gig' })
}

if(!contactEmail || contactEmail == '') {
    errors.push({text: "You must provide an email address for the gig"})
}

if(errors.length > 0) {
    res.render('add', {
        errors,
        title,
        technologies,
        description,
        budget,
        contactEmail
    });
} else {

    technologies = technologies.toLowerCase().replace(/, /g, ','); 

    const gig = {
        title: title,
        technologies: technologies,
        description: description,
        budget: budget,
        contact_email: contactEmail
    }

    db.sync()
        .then(() => Gig.create(gig))
        .then(gig => {
            console.log(gig.toJSON());
            res.status(200).redirect('/gigs')
        })
        .catch(err => {
            console.log(err);
        })
}

}); 


router.get('/search', (req, res) => {


    //let term = req.params.term; 
    let { term } = req.query; 

    
    // make Lowercase
    term = term.toLowerCase(); 

    if(!term || term == '') {
        res.redirect('/gigs')
    } else {
        Gig.findAll({
            where: {
                technologies: {
                    [Op.like]: `%${term}%`
                }
            }
        })
        .then(gigs => {
            res.render('search', {
                gigs
            })
        })
        .catch(err => {
            console.log(err);
        }); 
    }

})


module.exports = router; 