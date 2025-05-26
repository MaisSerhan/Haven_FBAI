const nodemailer = require("nodemailer");

const sendResetEmail = async (email, token, domain) => {
    // console.log('email', email , 'token', token , 'domain', domain);
    const resetLink = `${domain}/resetPassword?token=${token}`;
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.SENDER_EMAIL,
            pass: process.env.APP_KEY
        }
    });

    const mailOption = {
        from:`"Haven" <${process.env.SENDER_EMAIL}>`,
        to: email,
        subject: 'طلب إعادة تعيين كلمة المرور',
        html: `<div style="font-size: 16px;" dir="rtl"><span style="color: black !important;" >لقد طلبت إعادة تعيين كلمة المرور. انقر على الرابط لإعادة تعيين كلمة المرور الخاصة بك: </span><a href="${resetLink}">إعادة تعيين كلمة المرور</a></div>`
    };
    await transporter.sendMail(mailOption);
};

module.exports = {
    sendResetEmail
};
