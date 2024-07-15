import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "~/trpc/react";

export default function Verify({ email, setEmail, setForm }: { email: any, setEmail: any, setForm: any }) {
    const [sentCode, setSentCode] = useState(false)
    const [verification_code, setCode] = useState('')
    const verifyMutation = api.user.verify.useMutation()
    const sendMailMutation = api.user.sendMail.useMutation()

    const sendCodeReq = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        sendMailMutation.mutate({ email: email })
        console.log(sendMailMutation.error)
        if (sendMailMutation.error) {

        }
    }
    const verifyCode = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        verifyMutation.mutate({ verification_code })
        console.log(verifyMutation.error)
        if (!verifyMutation.error) setForm(2)
    }
    return (
        <div>
            <h1>Verify your email</h1>
            <form onSubmit={sendCodeReq}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border-2 border-solid" />
                <input type="submit" value="Send Code" />
            </form>
            <form onSubmit={verifyCode}>
                <input type="string" value={verification_code} onChange={(e) => setCode(e.target.value)} className="border-2 border-solid" />
                <input type="submit" value="Verify" />
            </form>
        </div>
    )
}