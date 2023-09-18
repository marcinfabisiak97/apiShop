import express, { Request, Response } from "express";
import nodemailer from "nodemailer";

const sendMail = express.Router();

// Create a transporter using your email provider's SMTP settings
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "needmartinshop@gmail.com",
    pass: process.env.GMAIL_APP,
  },
  tls: {
    rejectUnauthorized: false,
  },
});
// Define a route to send the email
sendMail.post("/sendemail", async (req: Request, res: Response) => {
  const { recipient } = await req.body;
  // Create the email template
  const mailOptions = {
    from: "needmartinshop@gmail.com",
    to: recipient,
    subject: "Shipment Confirmation",
    text: "Your shipment has been confirmed. Thank you for your order!",
  };
  // Send the email
  transporter.sendMail(mailOptions, (error: Error | null, info: any) => {
    if (error) {
      console.error("Error sending email:", error);
      res.status(500).send("Error sending email");
    } else {
      console.log("Email sent successfully");
      res.send("Email sent successfully");
    }
  });
});
sendMail.post("/sendorderdetails", async (req: Request, res: Response) => {
  const { data } = await req.body;
  console.log(req.body);
  const mailOptions = {
    from: "needmartinshop@gmail.com",
    to: "needmartinshop@gmail.com",
    subject: "Shipment Confirmation",
    html: `<p>${JSON.stringify(data)}</p>`,
  };

  transporter.sendMail(mailOptions, (error: Error | null, info: any) => {
    if (error) {
      console.error("Error sending email:", error);
      res.status(500).send("Error sending email");
    } else {
      console.log("Email sent successfully");
      res.send("Email sent successfully");
    }
  });
});
export default sendMail;
