const nodemailer = require("nodemailer");

require("dotenv").config();
const transpoter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.email,
    pass: process.env.password,
  },
});

function sendMail(toemail, otp) {
  var mailtransport = {
    from: process.env.email,
    to: toemail,
    subject: "Email verification",
    text: `Your otp is ${otp} this otp valid for 1 hour only`,
  };
  transpoter.sendMail(mailtransport, (err) => {
    if (err) {
      console.log("err :>> ", err.message);
    } else {
      console.log("email is sended");
      // res1.status(200).json({ message: "mail is Succfully sended" });
    }
  });
}
function sendlink(toemail, token, data) {
  var mailtransport = {
    from: process.env.email,
    to: toemail,
    subject: "Email verification",
    text: `Your id:- ${data.id} ,
     your Verify link  http://localhost:5002/api/emailverify/${token} 
     Note:- This link is valid only 1 hour 
     your code :-${data.code}`,

    // html: `<a href="http://www.facebook.com">link title</a>`,
  };
  transpoter.sendMail(mailtransport, (err) => {
    if (err) {
      console.log("err :>> ", err.message);
    } else {
      console.log("email is sended");
      // res1.status(200).json({ message: "mail is Succfully sended" });
    }
  });
}
module.exports = { sendlink, sendMail };
