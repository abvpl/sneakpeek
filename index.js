var express = require('express');
var app = express();
var http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require("nodemailer");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(cors());
console.log("helloworld");

app.get('/jayson', function (req, res) {
    console.log("at Hello Jayson GET");
    res.send("GET method served");
});

app.post('/jayson', function (r, s) {
    console.log("at Hello Jayson POST");
    s.send("POST method served");
});

app.use("/abhi", function (r, s) {
    console.log("Welcome",r.body);
    let result = {
        "code": 1,
        "status": "success"
    }
    s.send(result);
});


app.post('/sendemail', (req, res, next) => {
    console.log(req.body)
    if (req.body.tokenauth == "abrxtw") {
        var senderDetails = req.body.senderData;
        var emailData = req.body.emailData;
        /*Transport service is used by node mailer to send emails, it takes service and auth object as parameters.
        here we are using gmail as our service
        In Auth object , we specify our email and password
        */
        var transporter = nodemailer.createTransport({
            service: senderDetails.svc,
            auth: {
                user: senderDetails.creds.un,//replace with your email
                pass: senderDetails.creds.pw//replace with your password
            }
        });
        /*
        In mailOptions we specify from and to address, subject and HTML content.
        In our case , we use our personal email as from and to address,
        Subject is Contact name and
        html is our form details which we parsed using bodyParser.
        */
        var mailOptions = {
            from: emailData.fm,//replace with your email
            to: emailData.to,//replace with your email
            cc: emailData.cc,
            subject: emailData.sub,
            html: emailData.body
        };
        /*
        Here comes the important part, sendMail is the method which actually sends email, it takes mail options and
        call back as parameter
        */
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                res.send('error') // if error occurs send error as response to client
            }
            else {
                console.log('Email sent: ' + info.response);
                res.send('Sent Successfully')//if mail is sent successfully send Sent successfully as response
            }
        });
    } else {
        res.send("OK BYE");
    }
})

const port = process.env.PORT || 8080;
http.createServer(app).listen(port, function () {
    console.log("Example app listening at http://%s:%s", "localhost", port);
});