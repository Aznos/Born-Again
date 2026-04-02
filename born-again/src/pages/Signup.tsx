import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {supabase} from "../lib/supabase.ts";

export default function Signup() {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const navigate = useNavigate()

    async function handleSubmit(e: { preventDefault: () => void; }) {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signUp({ email, password })
        if(error) {
            setError(error.message)
            setLoading(false)
        } else {
            navigate("/dashboard")
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200">
            <div className="card bg-base-100 w-full max-w-sm shadow-xl">
                <div className="card-body gap-4">
                    <div>
                        <h1 className="card-title text-primary text-2xl">Create an account</h1>
                        <p className="text-base-content/60 text-sm mt-1">Start your journey today</p>
                    </div>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input input-bordered w-full"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input input-bordered w-full"
                            required
                        />
                        {error && (
                            <div role="alert" className="alert alert-error py-2 text-sm">
                                <span>{error}</span>
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full"
                        >
                            {loading ? <span className="loading loading-spinner loading-sm" /> : "Create account"}
                        </button>
                    </form>
                    <p className="text-center text-sm text-base-content/60">
                        Already have an account?{" "}
                        <Link to="/login" className="link link-primary font-medium">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
