import nodemailer from 'nodemailer'


export const sendMail = async ({ subject, receiver, body }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST,
    port: Number(process.env.NODEMAILER_PORT),
    secure: false,
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  if (!receiver) {
    throw new Error("Receiver email is missing");
  }

  await transporter.sendMail({
    from: `"Pranjal" <${process.env.NODEMAILER_EMAIL}>`,
    to: receiver,
    subject,
    html: body,
  });

 
};
