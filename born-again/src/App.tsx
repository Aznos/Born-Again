import {useAuth} from "./hooks/useAuth.ts";
import {Navigate, Route, Routes} from "react-router-dom";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Reader from "./pages/Reader.tsx";
import Favorites from "./pages/Favorites.tsx";
import type {ReactNode} from "react";
import Layout from "./components/layout/Layout.tsx";
import NotFound from "./pages/NotFound.tsx";

function ProtectedRoute({ children }: { children: ReactNode }) {
    const { user, loading } = useAuth()
    if(loading) return (
        <div className={"min-h-screen flex items-center justify-center"}>
            <span className={"loading loading-spinner loading-lg"} />
        </div>
    )

    if(!user) return <Navigate to="/" replace />
    return <>{children}</>
}

function App() {
    return (
        <Layout>
            <Routes>
                <Route path={"/"} />
                <Route path={"/login"} element={<Login />} />
                <Route path={"/signup"} element={<Signup />} />
                <Route path={"/dashboard"} element={
                    <ProtectedRoute><Dashboard /></ProtectedRoute>
                } />
                <Route path={"/favorites"} element={
                    <ProtectedRoute><Favorites /></ProtectedRoute>
                } />
                <Route path={"/read/:day"} element={
                    <ProtectedRoute><Reader /></ProtectedRoute>
                } />
                <Route path={"*"} element={<NotFound />} />
            </Routes>
        </Layout>
    )
}

export default App
