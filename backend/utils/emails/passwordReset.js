import nodemailer from "nodemailer";

export const sendPasswordResetEmail = async (user, resetPasswordURL) => {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.SMTP_SERVICE,
      auth: {
        user: process.env.STORFLEET_SMTP_MAIL,
        pass: process.env.STORFLEET_SMTP_MAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.STORFLEET_SMTP_MAIL,
      to: user.email,
      subject: "Password Reset",
      html: `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto">
          <h2>Password Reset Request</h2>
          <p>Hello ${user.name},</p>
          <p>You requested a password reset for your Storefleet account.</p>
          <p>
            <a href="${resetPasswordURL}"
               style="display:inline-block;padding:10px 20px;background:#20d49a;color:#fff;text-decoration:none;border-radius:5px">
              Reset Password
            </a>
          </p>
          <p>If you did not request this, you can safely ignore this email.</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Password reset email failed:", err.message);
  }
};
