const express = require('express');
const app = express();

app.set('view engine','ejs');

app.get('/',(req,res) => {
    res.render('homePage');
})

app.listen(3000, process.env.IP, () => {
    console.log('The YelpCamp Server Has Started!');
})