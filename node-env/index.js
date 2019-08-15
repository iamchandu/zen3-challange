const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const envResult = dotenv.config();
const fs = require('fs');
//============ Create Express app and initialize to app variable ========
var app = express();
// ============= initialize cros ==============
app.use(cors());
//========= initialize body parser ==========
app.use(bodyparser.json());
//=========== Start Code Here ====================
app.get('/',(req,res)=>{
        res.send({status:true});
});

app.get('/getEnvironment/:process', (req, res) => {
        try {
                if(process.env[req.params.process]) {
                        let processObj = {};
                        fs.readFile(process.env[req.params.process], 'utf8', function(err, contents) {
                                const line = contents.split(/\r\n|\n/);
                                line.map(l => {
                                        const singleVal = l.split('=');
                                        processObj[singleVal[0]] = singleVal[1];
                                })
                                res.send({status:true,data:processObj});
                        });
                       
                } else {
                        res.send({status: false, message: 'no Process found.'})
                }
        } catch (err) {
                res.send({status: false, message: 'no Process found.'})
        }
        
});

app.get('/setEnvironment/:process/:key/:value', (req, res) => {
        try {
                if(process.env[req.params.process]) {
                        let processObj = {};
                        fs.appendFile(process.env[req.params.process], '\n'+req.params.key+'='+req.params.value, function (err) {
                                if (err) throw err;
                                fs.readFile(process.env[req.params.process], 'utf8', function(err, contents) {
                                        const line = contents.split(/\r\n|\n/);
                                        line.map(l => {
                                                const singleVal = l.split('=');
                                                processObj[singleVal[0]] = singleVal[1];
                                        })
                                        res.send({status:true,data:processObj});
                                });
                        });
                } else {
                        res.send({status: false, message: 'no Process found.'})
                }
        } catch (err) {
                res.send({status: false, message: 'no Process found.'})
        }
        
});

app.post('/addNewProcess', (req, res) => {
        let process = req.body.process;
        let path = req.body.path;
        try {
                fs.appendFile('.env', '\n'+process+'='+path, function(err){
                        if(err){
                                res.send({status:false,message: 'failed to update data.'});
                        } else {
                                res.send({status: true, message: 'success'})
                        }
                });
        } catch (err) {
                res.send({status: false, message: 'Failed to execute.'})
        }
        
});

//============== Code Ends Here ===================
//====== Start Server ===================
app.listen(8000,()=>{
         console.log("Sever started in 8000 port");
});