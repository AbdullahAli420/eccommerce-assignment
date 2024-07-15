import axios from "axios";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { env } from "~/env";
import { cookies } from "next/headers";
import * as bcrypt from 'bcrypt'

export const userRouter = createTRPCRouter({
    signup: publicProcedure
        .input(z.object({ name: z.string(), email: z.string(), password: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const { name, email, password } = input;
            const user = await ctx.db.user.create({ data: { name, email, password } })
            cookies().set('user_email', user.email, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 7, // One week
                path: '/',
            })
            // if (!user.verified) throw
        }),
    sendMail: publicProcedure
        .input(z.object({ email: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const { email } = input;
            //check if user exists or not
            const user = await ctx.db.user.findUnique({ where: { email } })
            if (!user) throw new Error("User not found")
            if (user.verified) throw new Error("User already verified")
            //verification code sent
            const verification_code = Math.random() * 99999999
            await axios.post(env.smtp_url, null, {
                params: {
                    to: email,
                    subject: "Verify your email",
                    bodyHtml: `This is your one-time <b>verification</b> code:<b>${verification_code}</b>`,
                    from: env.smtp_email,
                    fromName: 'Muhammad Abdullah Ali'
                }
            })
            //verification code saving in cookie by using next/cookies
            bcrypt.hash(verification_code.toString(), env.salt_code, (err, hash) => {
                if (err) throw err
                cookies().set('verification_code', hash, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 60 * 60 * 24 * 7, // One week
                    path: '/',
                })
            })
            return true
        }),
    verify: publicProcedure
        .input(z.object({ verification_code: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const { verification_code } = input;
            const cookie = cookies().get('verification_code')?.value
            if (!cookie) throw new Error("Verification code not found")
            bcrypt.compare(verification_code, cookie, (err, res) => {
                if (err) throw err
                if (res) {
                    const user_email = cookies().get('user_email')?.value
                    ctx.db.user.update({
                        where: { email: user_email },
                        data: {
                            verified: true,
                        }
                    })
                }
            })
        }),
    login: publicProcedure
        .input(z.object({ email: z.string(), password: z.string() }))
        .query(async ({ ctx, input }) => {
            const { email, password } = input
            const user = await ctx.db.user.findUnique({ where: { email } })
            if (!user) throw new Error("User not found")
            const valid = await bcrypt.compare(password, user.password)
            if (!valid) throw new Error("Invalid password")
            return true
        })
})