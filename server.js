// server initialization
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


// files initialization
let jsObjectSkills = JSON.parse(fs.readFileSync('skills.json', 'utf8').toString())
let jsObjectStat = JSON.parse(fs.readFileSync('stat.json', 'utf8').toString())


// user id (fills after registration / authorisation)



// saving user choice
app.post('/add', urlencodeParser, function(req, res) {
    if(!req.body) return res.sendStatus(400)
    // general stat file init
    let skillsList = JSON.parse(fs.readFileSync('stat.json', 'utf8').toString())
    // user stat file init
    let userSkillsList = JSON.parse(fs.readFileSync(`users/u${id}.json`, 'utf8').toString())

    let count = 0;

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

        if (i.startsWith('f')) {
            skillsList['frontend'][jsObjectSkills[i.slice(1)]] += count
            userSkillsList['frontend'][jsObjectSkills[i.slice(1)]] += 1
        } else if (i.startsWith('a')) {
            skillsList['sysadmin'][jsObjectSkills[i.slice(1)]] += count
            userSkillsList['sysadmin'][jsObjectSkills[i.slice(1)]] += 1
        } else if (i.startsWith('d')){
            skillsList['data_scientist'][jsObjectSkills[i.slice(1)]] += count
            userSkillsList['data_scientist'][jsObjectSkills[i.slice(1)]] += 1
        }

    }

    // writing statistics to the file
    fs.writeFileSync('stat.json', JSON.stringify(skillsList), function(error) {
        if(error) throw error
        console.log("?????????????????????? ???????????? ?????????? ??????????????????.")
    })
    res.render('lab_1')
})


// result keepers init
let frontEnd = []
let dataScience = []
let sysAdmin = []


// filling result lists
for (let profession in jsObjectStat) {
    for (let skill in jsObjectStat[profession]) {
        if (profession === "frontend") {
            frontEnd.push([skill, jsObjectStat[profession][skill]]);
        } else if (profession === "data_scientist") {
            dataScience.push([skill, jsObjectStat[profession][skill]]);
        } else if (profession === "sysadmin") {
            sysAdmin.push([skill, jsObjectStat[profession][skill]]);
        }
    }
}


// sorting lists by values
dataScience.sort((a, b) => a[1] - b[1]).reverse()
frontEnd.sort((a, b) => a[1] - b[1]).reverse()
sysAdmin.sort((a, b) => a[1] - b[1]).reverse()


// user authorisation
app.get('/authorisation', async function(req, res) {
    const { name } = req.query;
    const { password } = req.query;

    let usersData = JSON.parse(fs.readFileSync(`usersData.json`, 'utf8').toString())
    let flag = false
    let id;

    usersData.forEach( (a) => {
        if (a[0] === name) {
            flag = true;
            id = a
        }})

    if (flag && (password === usersData[id][1])) {
        alert(`????????????????????????, ${name}`)
    } else {
        alert("???????????????? ????????????")
    }
    res.render('main')
})


// user registration
app.post('/registration', urlencodeParser, function(req, res) {
    if(!req.body) return res.sendStatus(400);
    console.log(req.body);
    let id = Date.now().toString()
    let user = {"id": id}
    let jsonData = fs.readFileSync('usersData.json' , 'utf8');
    let all = jsonData.substring(0, jsonData.length-1) + ', ' + JSON.stringify(user) + "]";
    fs.writeFileSync('usersData.json', all, function(error) {
        if(error) throw error;
        console.log(`User ${name} with id = ${id} registered successfully`);
    });
    let userData = fs.readFileSync('usersData.json' , 'utf8');
    let gift = userData.substring(0, userData.length-2) + ', ' + JSON.stringify(req.body).replace("{","") + "]";
    fs.writeFileSync('usersData.json', gift, function(error) {
        if(error) throw error;
        console.log(`User ${name} with id = ${id} registered successfully`);
    });
    let blankUser = fs.readFileSync(`users/blankUser.json`, 'utf8').toString();
    fs.writeFileSync(`users/u${id}.json`, blankUser, function(error) {
        if(error) throw error;
        console.log(`User ${name} with id = ${id} registered successfully`);
    });
    res.render('main');
});
// user login
app.post('/login', urlencodeParser, function(req, res) {

});


// load main page
app.get('/', function (req, res) {
    res.render('main');
});


// switching pages
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
    } else if(req.params.name === 'login') {
        res.render('login');
    } else if(req.params.name === 'reg') {
        res.render('reg');
    } else if(req.params.name === 'easy_aud_test') {
        res.render('easy_aud_test');
    } else if(req.params.name === 'easy_eye_test') {
        res.render('easy_eye_test');
    } else if(req.params.name === 'hard_aud_test') {
        res.render('hard_aud_test');
    } else if(req.params.name === 'hard_eye_test') {
        res.render('hard_eye_test');
    } else if(req.params.name === 'stat') {
        res.render('stat', {dataScience: dataScience, frontEnd: frontEnd, sysAdmin: sysAdmin});
    } else {
        res.sendFile(__dirname + '/404.html');
    }
});
