const express = require('express');
const app = express();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const db = new sqlite3.Database(process.env.DB_NAME);

app.use(express.urlencoded({extended: true}));
app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'templates'));

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS user( id INTEGER PRIMARY KEY AUTOINCREMENT, firstname TEXT, lastname TEXT, age INTEGER, phone TEXT )`);
});

app.get('/', async(req,res) => {
    res.render('index');
});

app.get('/add',(req,res) => {
    res.render('add');
});

app.get('/edit/:id',(req,res) => {
    const id = req.params.id;
    sql = "SELECT * FROM user WHERE id = ?";
    db.all(sql,[id], async(err, result) => {
        if(err){
            console.log(err);
        }else{
            res.render('edit', {result: result, id: id});
        }
    });
});


app.get('/member',(req,res) => {
    sql = "SELECT * FROM user";
    db.all(sql, async(err, result) => {
        if(err){
            console.log(err);
        }else{
            res.render('member', {result: result});
        }
    });
});

app.post('/add',(req,res) => {
    const {firstname, lastname, age, phone} = req.body;
    sql = "INSERT INTO user(firstname, lastname, age, phone) VALUES(?, ?, ?, ?)";
    db.run(sql,[firstname, lastname, age, phone],(err) => {
        if(err){
            console.log(err);
        }else{
            res.redirect('member');
        }
    });
});

app.post('/edit/:id',(req,res) => {
    const id = req.params.id;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const age = req.body.age;
    const phone = req.body.phone;
    sql = "UPDATE user SET firstname = ?, lastname = ?, age = ?, phone = ? WHERE id = ?";
    db.run(sql,[firstname, lastname, age, phone, id], (err) => {
        if(err){
            console.log(err);
        }else{
            db.all('SELECT * FROM user',(err,result) => {
                if(err){
                    console.log(err);
                }else{
                    res.redirect('/');
                }
            })
        }
    });
});

app.get('/delete/:id', (req,res) => {
    const id = req.params.id;
    sql = 'DELETE FROM user WHERE id = ?';
    db.run(sql,[id],(err) => {
        if(err){
            console.log(err);
        }else{
            res.redirect('/');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Ready on port ${PORT}`);
}); 