"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendMail = express_1.default.Router();
// Create a transporter using your email provider's SMTP settings
const transporter = nodemailer_1.default.createTransport({
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
sendMail.post("/sendemail", async (req, res) => {
    const { recipient } = await req.body;
    // Create the email template
    const mailOptions = {
        from: "needmartinshop@gmail.com",
        to: recipient,
        subject: "Shipment Confirmation",
        text: "Your shipment has been confirmed. Thank you for your order!",
    };
    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);
            res.status(500).send("Error sending email");
        }
        else {
            console.log("Email sent successfully");
            res.send("Email sent successfully");
        }
    });
});
sendMail.post("/sendorderdetails", async (req, res) => {
    const { data } = await req.body;
    console.log(req.body);
    const mailOptions = {
        from: "needmartinshop@gmail.com",
        to: "needmartinshop@gmail.com",
        subject: "Shipment Confirmation",
        html: `<p>${JSON.stringify(data)}</p>`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);
            res.status(500).send("Error sending email");
        }
        else {
            console.log("Email sent successfully");
            res.send("Email sent successfully");
        }
    });
});
exports.default = sendMail;
