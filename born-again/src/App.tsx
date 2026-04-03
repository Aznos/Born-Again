import {useAuth} from "./hooks/useAuth.ts";
import {Navigate, Route, Routes} from "react-router-dom";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Reader from "./pages/Reader.tsx";
import Favorites from "./pages/Favorites.tsx";

function ProtectedRoute({ children }) {
    const { user, loading } = useAuth()
    if(loading) return <div className={"min-h-screen"} />
    if(!user) return <Navigate to="/login" replace />
    return children
}

function App() {
    // const [text, setText] = useState<string | null>(null)
    //
    // useEffect(() => {
    //     getPassage("JHN", 1, 3, 7).then(setText)
    // }, [])
    //
    // return <>
    //     {text && <div className="text-4xl text-primary" dangerouslySetInnerHTML={{ __html: text }} />}
    // </>

    return (
        <Routes>
            <Route path={"/"} element={<Navigate to={"/dashboard"} replace />} />
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
        </Routes>
    )
}

export default App
