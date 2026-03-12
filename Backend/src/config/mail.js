const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

exports.sendOTPEmail = async(email, otp) => {
    await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Nenrasha Password Reset OTP',
        html: `<p>Your OTP for password reset is: <strong>${otp}</strong></p>`
    });
};