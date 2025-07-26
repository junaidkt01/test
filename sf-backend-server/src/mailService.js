const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "junaidktkmn@gmail.com",
        pass: "erel wkwh adhw xvmj"
    }
});

async function sendOtpEmail(toEmail, otp, studioId) {
    const mailOptions = {
        from: 'Company mail',
        to: toEmail,
        subject: "Your Studio OTP Verification",
        html: `
      <h3>Hello from Our Platform!</h3>
      <p><strong>OTP:</strong> ${otp}</p>
      <p><strong>Studio ID:</strong> ${studioId}</p>
      <p>Please use the OTP to verify and activate your studio.</p>
    `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: " + info.messageId);
        return info;
    } catch (err) {
        console.error("Failed to send email:", err);
        throw err;
    }
}

module.exports = { sendOtpEmail };
