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
      html: `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto">
          <h2>Welcome, ${user.name} 👋</h2>
          <p>Your Storefleet account has been created successfully.</p>
          <p>You can now explore products, place orders, and manage your profile.</p>
          <p>Happy shopping!</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Welcome email failed:", error.message);
  }
};
