import {useAuth} from "../../hooks/useAuth.ts";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {supabase} from "../../lib/supabase.ts";

export default function Navbar() {
    const { user } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()

    async function handleSignout() {
        await supabase.auth.signOut()
        navigate("/login")
    }

    function isActive(path: string) {
        return location.pathname === path
    }

    return (
        <div className={"navbar bg-base-200 border-b border-base-300 px-6"}>
            <div className={"flex-1"}>
                <Link to={"/dashboard"} className={"text-lg font-semibold tracking-tight"}>
                    Born Again
                </Link>
            </div>
            {user && (
                <div className={"flex-none flex items-center gap-2"}>
                    <Link to={"/dashboard"} className={`btn btn-ghost btn-sm ${isActive("/dashboard") ? "btn-active" : ""}`}>
                        Home
                    </Link>
                    <Link to={"/favorites"} className={`btn btn-ghost btn-sm ${isActive("/favorites") ? "btn-active" : ""}`}>
                        Favorites
                    </Link>
                    <Link to={"/plan"} className={`btn btn-ghost btn-sm ${isActive("/favorites") ? "btn-active" : ""}`}>
                        Plan
                    </Link>
                    <div className={"dropdown dropdown-end"}>
                        <div
                            tabIndex={0}
                            role="button"
                            className={"btn btn-ghost btn-circle avatar placeholder"}
                        >
                            <div className={"bg-neutral text-neutral-content rounded-full w-8"}>
                                <span className={"text-xs"}>
                                    {user.email?.[0].toUpperCase()}
                                </span>
                            </div>
                        </div>
                        <ul
                            tabIndex={0}
                            className={"menu menu-sm dropdown-content bg-base-200 rounded-box z-50 mt-3 w-52 p-2 shadow border border-base-300"}
                        >
                            <li>
                                <span className={"text-base-content/40 text-xs px-2 py-1 truncate"}>
                                    {user.email}
                                </span>
                            </li>
                            <div className={"divider my-0"} />
                            <li>
                                <button onClick={handleSignout} className={"text-error"}>
                                    Sign out
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    )
}