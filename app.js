const fs= require("fs");
const axios=require('axios');
const https=require('https');
const ejs= require("ejs");
//const mailchimp = require("@mailchimp/mailchimp_transactional");
const mailchimp = require('@mailchimp/mailchimp_marketing');
const client = require("mailchimp");
const express = require("express");
const bodyParser= require("body-parser");
const MailChimpAPI = require("mailchimp/lib/mailchimp/MailChimpAPI");

//var msg= require(__dirname+"/exportFunctions");
const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');


app.get('/',function(req,res){

      res.render('signup');


})
app.post('/failure', (req,res)=> {

  res.redirect('/');
})
app.get('/test',function (req,rest) {
  var url ='https://us2.api.mailchimp.com/3.0/lists/366b6c0560/members/';
  var options = {
    
    method:'GET',

      auth:"medo:8d7618041d0d0a0d72556affa1f3361f-us2"
    
        
      }
  https.get(url,options, (res) => {
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);
  
    res.on('data', (d) => {
    process.stdout.write(d);
    
   rest.send(JSON.parse(d));
  //rest.send(JSON.stringify(d));
    // console.log(JSON.stringify(d));
    });
  
  }).on('error', (e) => {
    console.error(e);
  });

  })
app.post('/',function(req,res){

    const fName= req.body.firstName;
    const lName=req.body.lastName;
    const email=req.body.email;


    const data = {
        members:[
            {
                email_address:email,
                status:"subscribed",
                merge_fields:
                    {
                        FNAME:fName,
                        LNAME:lName,
                        ADDRESS:"Dublin"
                    }
                
            }
        ]
           
    
        }
        var options = {
          method:'POST',

            auth:"medo:8d7618041d0d0a0d72556affa1f3361f-us2"
          
              
            }
          
  const jsonData=JSON.stringify(data);
 var url = "https://us2.api.mailchimp.com/3.0/lists/366b6c0560";



/* mailchimp.setConfig({
    apiKey: "8d7618041d0d0a0d72556affa1f3361f-us2",
    server: "us2"
  });
  
  const listId = "366b6c0560";
  const subscribingUser = {
    firstName: fName,
    lastName: lName,
    email: email
  };
  
  async function run() {
    const response = await  mailchimp.lists.addListMember(listId, {
      email_address: subscribingUser.email,
      status: "subscribed",
      merge_fields: {
        FNAME: subscribingUser.firstName,
        LNAME: subscribingUser.lastName,
        ADDRESS:"7 rue toubkal"
      }
    });
  if(response.email_address===email)
  {
    console.log("account already exist")
  }
  else{
    console.log( `Successfully added contact as an audience member. The contact's id is ${ response.id }.`);
    res.render('success',{name:response.email_address});
     console.log(response.email_address);
     console.log(response);
  }
  }
  
  run();
 /*axios.post(url,jsonData,options).then(function (response) {
 
    res.render('test',{text:response.data, txt:response.data});

    console.log(response.data);
 
})
.catch(function (error) {

      console.error(error);
  });  */
const request= https.request(url,options,function (response) { 

  if(response.statusCode===200)
  {
    res.render('success',{name:fName});
  }
  else

 {
   res.render('/failure');
 }
 response.on("data", function (data) { 
  console.log(JSON.parse(data));
    
   })


   
 })
 request.write(jsonData) ;
 request.end();



})



app.listen(process.env.PORT || 3000,()=>console.log("app listening to port 3000"))
//366b6c0560