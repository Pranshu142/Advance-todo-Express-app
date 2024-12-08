import nodemailer from "nodemailer";

export const sendCongratulatoryEmail = async (email, username) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // or your email service provider
      auth: {
        user: process.env.EMAIL, // Your email
        pass: process.env.EMAIL_PASSWORD, // Your email password
      },
      //   debug: true,
      //   logger: true,
    });

    const mailOptions = {
      from: `${process.env.EMAIL}`, // Sender address
      to: email, // Recipient's email
      subject: `Congratulations, ${username}! 🎉`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #444;">
          <h1 style="color: #4CAF50;">Congratulations, ${username}!</h1>
          <p>You've completed all your tasks for today. Great job staying on top of your goals!</p>
          <p>Keep up the fantastic work and continue achieving your goals.</p>
          <p>Here's a little motivational quote for you:</p>
          <blockquote style="margin: 20px 0; font-size: 1.2em; font-style: italic;">
            "The secret of getting ahead is getting started." - Mark Twain
          </blockquote>
          <p style="margin-top: 20px;">Best regards,</p>
          <p><strong>Pros Team</strong></p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Congratulatory email sent successfully!");
  } catch (error) {
    console.error("Error sending congratulatory email:", error);
  }
};
