import {Link} from "react-router-dom";

export default function NotFound() {
    return (
        <div className={"min-h-screen flex flex-col items-center justify-center gap-4 text-center px-6"}>
            <h1 className={"text-4xl font-bold"}>404</h1>
            <p className={"text-base-content/40"}>This page doesn't exist.</p>
            <Link to={"/"} className={"btn btn-ghost btn-sm"}>Go home</Link>
        </div>
    )
}