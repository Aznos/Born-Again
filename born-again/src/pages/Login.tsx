import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {supabase} from "../lib/supabase.ts";

export default function Login() {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const navigate = useNavigate()

    async function handleSubmit(e: { preventDefault: () => void; }) {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if(error) {
            setError(error.message)
            setLoading(false)
        } else {
            navigate("/dashboard")
        }
    }

    return (
        <div className={"min-h-screen flex items-center justify-center"}>
            <div className={"w-full max-w-sm p-8"}>
                <h1 className={"text-primary font-semibold mb-1 text-2xl"}>Welcome back</h1>
                <p className={"text-sm mb-8 text-secondary"}>Sign in to continue your journey</p>
                <form onSubmit={handleSubmit} className={"flex flex-col gap-4"}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={"bg-primary border border-secondary rounded-xl px-4 py-3 text-secondary text-sm placeholder:text-accent focus:outline-none focus:shadow-outline"}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={"bg-primary border border-secondary rounded-xl px-4 py-3 text-secondary text-sm placeholder:text-accent focus:outline-none focus:shadow-outline"}
                        required
                    />
                    {error && <p className={"text-red-400 text-sm"}>{error}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className={"bg-accent text-primary rounded-lg py-3 text-sm font-medium disabled:opacity-50"}
                    >
                        {loading ? "Signing in.." : "Sign in"}
                    </button>
                </form>
                <p className={"text-secondary text-sm mt-6 text-center"}>
                    No account?{" "}
                    <Link to={"/signup"} className={"text-primary"}>Create one for free</Link>
                </p>
            </div>
        </div>
    )
}