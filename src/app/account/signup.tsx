"use client"
import { usePathname, useSearchParams, useRouter } from "next/navigation"
import { useState } from "react"
// import { api } from "~/trpc/server"
import { api } from "~/trpc/react"

export default function Signup({ email, setEmail, setForm }: { email: any, setEmail: any, setForm: any }) {
    const [name, setName] = useState('')
    // const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { mutate, error } = api.user.signup.useMutation()

    const router = useRouter()

    const createAccount = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
        mutate({ name, email, password })
        if (!error) setForm(1)
    }
    return (
        <div>
            <h1>Signup</h1>
            <form onSubmit={createAccount}>
                <input type="text" name="name" placeholder="Username" value={name} onChange={(e) => setName(e.target.value)} />
                <input type="email" name="email" placeholder="example@123.any" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <input type="submit" value="Signup & verify" />
            </form>
        </div>
    )
}