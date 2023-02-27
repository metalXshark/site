const port = 7000;
const host = 'localhost';

let fs = require('fs');
let express = require('express');
let bodyParser = require('body-parser');

let urlencodeParser = bodyParser.urlencoded({ extended: false });
let app = express();

app.use('/public', express.static('public'));
app.set('view engine', 'ejs');

app.listen(port, host, function (){
    console.log('Server - http://' + host + ':' + port);
})



let file = fs.readFileSync('skills.json', 'utf8').toString();
let jsObjectSkills = JSON.parse(file);

let file1 = fs.readFileSync('stat.json', 'utf8').toString()
let jsObjectStat = JSON.parse(file1)

app.post('/add', urlencodeParser, function(req, res) {
    if(!req.body) return res.sendStatus(400);
    // console.log(req.body);
    let data = fs.readFileSync('stat.json', 'utf8').toString();
    let skillsList = JSON.parse(data);

    let count = 0;
    console.log(skillsList)
    for (i in req.body) {
        if (i === 'specialist_f') {
            count = 2
        } else if (i === 'specialist_d') {
            count = 2
        } else if (i === 'specialist_a') {
            count = 2
        } else {
            count = 1
        }

        console.log(i);

        if (i.startsWith('f')) {
            skillsList['frontend'][jsObjectSkills[i.slice(1)]] += count
        } else if (i.startsWith('a')) {
            skillsList['sysadmin'][jsObjectSkills[i.slice(1)]] += count
        } else if (i.startsWith('d')){
            skillsList['data_scientist'][jsObjectSkills[i.slice(1)]] += count
        }

    }

    fs.writeFileSync('stat.json', JSON.stringify(skillsList), function(error) {
        if(error) throw error;
        console.log("Асинхронная запись файла завершена.");
    });
    res.render('lab_1');
});



app.get('/', function (req, res) {
    res.render('main');
});
app.get('/:name', function(req, res) {
    if(req.params.name === 'main') {
        res.render('main');
    } else if(req.params.name === 'lab1') {
        res.render('lab_1');
    } else if(req.params.name === 'lab2') {
        res.render('lab_2');
    } else if(req.params.name === 'fronted') {
        res.render('fronted');
    } else if(req.params.name === 'data') {
        res.render('data');
    } else if(req.params.name === 'sysadmin') {
        res.render('sysadmin');
    } else if(req.params.name === 'stat') {
        res.render('stat', {skillName: jsObjectSkills, skillStat: jsObjectStat});
    }  else {
        res.sendFile(__dirname + '/404.html');
    }
});