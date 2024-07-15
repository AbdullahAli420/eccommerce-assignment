import { useState } from "react"
import { api } from "~/trpc/react"
import { useRouter } from "next/navigation"

export default function ({ email, setEmail, setForm }: { email: any, setEmail: any, setForm: any }) {
    // const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter()

    const Login = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
        const userLogin = api.user.login.useQuery({ email, password })
        console.log(userLogin)
        if (userLogin) router.push('/categories')
    }

    return (
        <div>
            <form onSubmit={Login}>
                <input type="email" name="email" placeholder="example@123.any" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <input type="submit" value="Signup & verify" />
            </form>
        </div>
    )
}