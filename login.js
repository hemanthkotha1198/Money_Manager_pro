// const express=require("express");
// const mysql=require("mysql");
// const bodyparser=require("body-parser");
// const app=express();
// const port=5000;
// const db=mysql.createConnection({
//     host:"localhost",
//     user:"root",
//     password:"",
//     database:"PKBANKS"
// });
// // connecting to the database
// db.connect(err=>{
//  if(err)throw err;
//  console.log("Connected  to the MYSQL.");
// });
// //using ejs template engine
// app.set('view engine','ejs');
// //serving all the static files in the views folder.
// app.use(express.static('views'));
// app.use(bodyparser.urlencoded({extended:false}));
// app.get('/',(req,res)=>{
//     res.render('login');
// });
// app.post('/login',(req,res)=>{
//     const accountid=req.body.acc_id;
//     const password=req.body.passwd;
//     const sql= `SELECT * FROM register WHERE ac_id=? AND password=?`;
//     db.query(sql,[accountid,password],(err,result)=>{
//      if(err) throw err;
//      if(result.length>0)
//      {
//          res.send("loged in");
//      }   
//      else{
//          console.log("login failed.")
//      }
//     })
// })

const express = require('express');
const mysqlx = require('@mysql/xdevapi');

const bodyParser = require('body-parser');

const app = express();
const port = 3000;
let userid="";
let pass="";
let balence=0;
let name1="";
// Set up MySQL connection
const config={
    host: 'localhost',
    user: 'root',
    password: 'prasadnaidu',
    database: 'PKBANKS',
    schema:'node_mysql',

};
mysqlx.getSession({

    user: config.user,
    
    password: config.password,
    
    host: config.host,
    
    port: config.port,
    
    })
// db.connect(err => {
//     if (err) throw err;
//     console.log('Connected to MySQL database');
// });

// Use EJS template engine
app.set('view engine', 'ejs');

// Serve static files
app.use(express.static('views'));

// Parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: false }));

// Define routes
app.get('/login', (req, res) => {
    res.render('login');    
});
app.get('/loginOption', (req, res) => {
    res.render('LoginOption');    
});
app.get('/BalEnq', (req, res) => {
    res.render('BalEnq');    
});
app.get('/Withdraw', (req, res) => {
    res.render('Withdraw'); // Render the EJS file
});
app.get('/withamount', (req, res) => {
    res.render('withamount');    
});
app.get('/WithdrawAmountError', (req, res) => {
    res.render('WithdrawAmountError');    
});
app.get('/Deposite', (req, res) => {
    res.render('Deposite'); // Render the EJS file
});
app.get('/DepositeAmount', (req, res) => {
    res.render('DepositeAmount');    
});
app.get('/DepositeError', (req, res) => {
    res.render('DepositeError');    
});
app.get('/cpasswd', (req, res) => {
    res.render('cpasswd');    
});
app.get('/UpdatedPassword', (req, res) => {
    res.render('UpdatedPassword');    
});
app.get('/exit', (req, res) => {
    res.render('login');    
});

// app.post('/login', (req, res) => {
//     const email = req.body.acc_id;
//     const passwd = req.body.passwd;
//     userid = email ;
//     pass = passwd;

//     const sql= `SELECT * FROM register WHERE ac_id=? and password = ?;`;

//     db.query(sql, [email,passwd], (res,err) => {
//         if (err) throw err;
            
//         results.forEach(user => {
//             balence = `${user.amount}`,
//             name1 = `${user.name}`
//          });
//        //   console.log(results);
//            console.log('login seccessfull')
//            res.redirect("loginOption");
           
//         // }else{
//         //     res.send(err);
//         // }
//     });
// });
app.post('/login', (req, res) => {
    const email = req.body.acc_id;
    const passwd = req.body.passwd;
    userid = email ;
    pass = passwd;

    const sql= `SELECT * FROM register WHERE ac_id=? and password = ?;`;

    db.query(sql, [email, passwd], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            results.forEach(user => {
                balence = user.amount,
                name1 = user.name
            });
            console.log('login successful')
            res.redirect("/loginOption");
        } else {
            console.log('login failed');
            res.send("Login failed. Please check your credentials.");
        }
    });
});

app.post('/BalEnq',(req,res)=>{
    console.log(balence)
    const data = {
      balence: balence,
      name:name1,
    };
    res.render('BAlEnq', { data });
});
app.post('/Withdraw', (req, res) => {
    
    res.redirect("Withdraw");
});
app.post('/withamount', (req, res) => {
    const withdrawAmount = req.body.withd;
    console.log(withdrawAmount);
    const amount = parseInt(withdrawAmount);
    console.log(typeof amount);
    const data = {
        balence: balence,
        name:name1,
      };
    console.log(balence);
    if(amount<=balence){
        
        const finalAmount=balence-amount;
        const famount = {
          fAmount:finalAmount
          };
    // const  = req.body.withd;
    const sql=` UPDATE register SET amount = ? WHERE ac_id=? and password = ?;`;
        
    
    db.query(sql, [finalAmount,userid,pass], (err, results) => {
        if (err) throw err;
        res.render('withamount', { famount });
        // res.redirect("withamount" , { data });
        });
}
    else{
        res.redirect("WithdrawAmountError");
    }
});
app.post('/Deposite', (req, res) => {
    
    res.redirect("Deposite");
});
app.post('/DepositeAmount', (req, res) => {
    const withdrawAmount = req.body.depAmount;
    console.log(withdrawAmount);
    const amount = parseInt(withdrawAmount);
    const bal=parseInt(balence);
    console.log(typeof amount);
    if(amount>0){
        
        const finalAmount=bal+amount;
        const famount = {
          fAmount:finalAmount
          };
    // const  = req.body.withd;
    const sql=` UPDATE register SET amount = ? WHERE ac_id=? and password = ?;`;
        
    
    db.query(sql, [finalAmount,userid,pass], (err, results) => {
        if (err) throw err;
        res.render('DepositeAmount', { famount });
        // res.redirect("withamount" , { data });
        });
}
    else{
        res.redirect("DepositeError");
    }
});


app.post('/cpasswd', (req, res) => {
    
    res.redirect("cpasswd");
});
app.post('/UpdatedPassword', (req, res) => {
    const changePassword = req.body.cpasswd;
    console.log(changePassword);
    const sql=` UPDATE register SET password = ? WHERE ac_id=? and password = ?;`;
        
    
    db.query(sql, [changePassword,userid,pass], (err, results) => {
        if (err) throw err;
        res.render('UpdatedPassword');

        });
});
app.post('/exit', (req, res) => {
    res.redirect("login");
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
