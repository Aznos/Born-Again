import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {supabase} from "../lib/supabase.ts";

export default function Login() {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const navigate = useNavigate()

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
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
        <div className="min-h-screen flex items-center justify-center bg-base-200">
            <div className="card bg-base-100 w-full max-w-sm shadow-xl">
                <div className="card-body gap-4">
                    <div>
                        <h1 className="card-title text-primary text-2xl">Welcome back</h1>
                        <p className="text-base-content/60 text-sm mt-1">Sign in to continue your journey</p>
                    </div>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                        <input
                            type="email"
                            placeholder="Email"
                            aria-label="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input input-bordered w-full"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            aria-label="Password"
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
                            {loading ? <span className="loading loading-spinner loading-sm" /> : "Sign in"}
                        </button>
                    </form>
                    <p className="text-center text-sm text-base-content/60">
                        No account?{" "}
                        <Link to="/signup" className="link link-primary font-medium">Create one for free</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}