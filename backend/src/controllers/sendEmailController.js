const prisma = require("../config/db");
const nodemailer = require("nodemailer");
const { GMAIL_USER, GMAIL_PASS, FROM_EMAIL, TEAM_EMAIL } = require("../utils/constants");
const InternalServer = require("../utils/internal-server");

exports.sendEmail = async (req, res) => {
  try {
    const { email, firstName, lastName, message, productId } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { category: true },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const request = await prisma.request3D.create({
      data: {
        email,
        firstName: firstName || null,
        lastName: lastName || null,
        message: message || null,
        productId: productId || null,
      },
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_PASS,
      },
    });

    const teamRecipients = TEAM_EMAIL.split(",").map((e) => e.trim());

    await transporter.sendMail({
      from: `"3D Request System" <${FROM_EMAIL}>`,
      replyTo: email,
      to: teamRecipients, 
      subject: `📩 New 3D file request from ${email}`,
      text: `
A new 3D file request has been submitted.

Requester: ${firstName || ""} ${lastName || ""}
Email: ${email}

📌 Product Info:
- ID: ${product.id}
- Name: ${product.name}
- Category: ${product.category?.name || "-"}

Message:
${message || "-"}

Request ID: ${request.id}
Created at: ${request.createdAt}
      `,
    });

    await transporter
      .sendMail({
        from: `"3D Support Team" <${FROM_EMAIL}>`,
        to: email,
        subject: "✅ We have received your 3D file request",
        text: `Hello ${firstName || ""} ${lastName || ""},

We have received your 3D file request. Our team will get back to you shortly.

📌 Product Info:
- Name: ${product.name}
- Category: ${product.category?.name || "-"}

Request ID: ${request.id}
        `,
      })
      .catch((err) => {
        console.warn("Couldn't send confirmation email:", err.message);
      });

    res.json({ ok: true, requestId: request.id });
  } catch (error) {
    InternalServer(res, error);
  }
};
