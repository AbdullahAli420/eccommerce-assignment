import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { env } from "~/env";
import * as bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

// const cookieStore = cookies()

export const userRouter = createTRPCRouter({
  signup: publicProcedure
    .input(
      z.object({ name: z.string(), email: z.string(), password: z.string() }),
    )
    .mutation(async ({ ctx, input }) => {
      let { name, email, password } = input;
      const salt = bcrypt.genSaltSync(parseInt(env.salt_code));
      password = bcrypt.hashSync(password, salt);
      const emailCheck = await ctx.db.user.findUnique({ where: { email } });
      console.log(emailCheck);
      if (emailCheck === null)
        await ctx.db.user.create({ data: { name, email, password } });
      else throw new Error("Email already exist");
      return true;
    }),
  sendMail: publicProcedure
    .input(z.object({ email: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { email } = input;
      console.log("headers");
      //check if user exists or not
      const user = await ctx.db.user.findUnique({ where: { email } });
      if (!user) throw new Error("User not found");
      if (user.verified) throw new Error("User already verified");

      //send mail
      const verification_code = Math.floor(Math.random() * 99999999).toString();
      const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
          user: "jamil.oreilly82@ethereal.email",
          pass: "8dcTVxkjEpDS15UBQN",
        },
      });
      var mailOptions = {
        from: env.smtp_email,
        to: email,
        subject: "Verify your email",
        html: `This is your one-time <b>verification</b> code:<b>${verification_code}</b>`,
      };
      transporter.sendMail(mailOptions, (error: any) => {
        if (error) {
          throw error;
        }
      });

      //verification code saving in cookie by using
      const salt = bcrypt.genSaltSync(parseInt(env.salt_code));
      const hash = bcrypt.hashSync(verification_code, salt);
      return { res: true, verification_code: hash };
    }),
  verify: publicProcedure
    .input(
      z.object({
        verification_code: z.string(),
        email: z.string(),
        hash: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { verification_code, email, hash } = input;
      const compare = await bcrypt.compare(verification_code, hash);
      if (!compare) throw new Error("Verification code not matches");
      else {
        await ctx.db.user.update({
          where: { email: email },
          data: {
            verified: true,
          },
        });
      }
      return true;
    }),
  login: publicProcedure
    .input(z.object({ email: z.string(), password: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { email, password } = input;
      const user = await ctx.db.user.findUnique({ where: { email } });
      if (!user) throw new Error("User not found");
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error("Invalid password");
      if (!user.verified) throw new Error("User is not verified");
      return {
        res: true,
        token: jwt.sign(user, env.JWT_SECRET_KEY),
        userId: user.id,
      };
    }),
});
