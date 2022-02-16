const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'neil.auer77@ethereal.email', // generated ethereal user
        pass: 'FGtWaXsNXGerEWQnuk', // generated ethereal password
    }
});

const sendWelcomeEmail = async (email,name) => {

    await transporter.sendMail({
        from: 'chaulingo1@gmail.com', // sender address
        to: email, // list of receivers
        subject: `Welcome aboard ${name}`, // Subject line
        text: "Hello world?", // plain text body
        html: `<b>Welcome to my app ${name}, we are very excited with you in here!</b>`, // html body
    });

}

const sendCancelationEmail = async (email,name) => {
    await transporter.sendMail({
        from: 'chaulingo1@gmail.com', // sender address
        to: email, // list of receivers
        subject: `We are sad to see you leave ${name}!`, // Subject line
        text: "Why did you leave the platform?", // plain text body
        html: ``, // html body
    });
}


module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}