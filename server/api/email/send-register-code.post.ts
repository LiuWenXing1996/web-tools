import { z } from "zod";
import nodemailer from "nodemailer";

const paramsSchema = z.object({
  email: z.string().min(1),
});

export type Params = z.infer<typeof paramsSchema>;
export default defineEventHandler(async (event) => {
  const data = await readValidatedBody(event, (data) => {
    return paramsSchema.parse(data);
  });

  const transporter = nodemailer.createTransport({
    host: "smtp.163.com",
    port: 465,
    secure: true,
    auth: {
      user: "web_tools2024@163.com",
      pass: "NAdBMDQYPuPkGMCE",
    },
  });

  const info = await transporter.sendMail({
    from: '"Web Tools" web_tools2024@163.com', // sender address
    to: data.email,
    subject: "Hello ✔",
    text: "Hello worldsss?",
    html: "<b>Hellssso world?</b>",
  });

  console.log("Message sent: %s", info.messageId);
  return true;
});
