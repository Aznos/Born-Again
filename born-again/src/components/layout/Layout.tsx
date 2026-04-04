import type {ReactNode} from "react";
import {useAuth} from "../../hooks/useAuth.ts";
import Navbar from "./Navbar.tsx";

interface LayoutProps {
    children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
    const { user } = useAuth()

    return (
        <div className={"min-h-screen flex flex-col"}>
            {user && <Navbar />}
            <main className={"flex-1"}>
                {children}
            </main>
            <footer className={"footer footer-center p-4 text-base-content/20 text-xs border-t border-base-300"}>
                <p>
                    Born Again is free and always will be.{' '}
                </p>
                <a
                    href={"https://buymeacoffee.com/aznos"}
                    target={"_blank"}
                    rel={"noreferrer"}
                    className={"link link-hover"}
                >
                    Support hosting
                </a>
                <a
                    href={"https://github.com/aznos/BornAgain"}
                    target={"_blank"}
                    rel={"noreferrer"}
                    className={"link link-hover"}
                >
                    Open source
                </a>
            </footer>
        </div>
    )
}