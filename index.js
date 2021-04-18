var express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.set("view engine","ejs");
app.set("views","./views");

app.get('/',(req,res) =>{
    res.render('canvas');
});

app.listen(5000, ()=>{
    console.log("Listening on port 3000");
});
