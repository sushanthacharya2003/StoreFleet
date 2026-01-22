import nodemailer from "nodemailer";

export const sendWelcomeEmail = async (user) => {
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
      subject: "Welcome to Storefleet",
      html: `<h2>Welcome ${user.name}</h2>`,
    });

    console.log("Welcome email sent");
  } catch (error) {
    console.error("Email Error:", error.message);
  }
};
