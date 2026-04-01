import {useAuth} from "./hooks/useAuth.ts";
import {Navigate, Route, Routes} from "react-router-dom";
import Login from "./pages/Login.tsx";

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
        </Routes>
    )
}

export default App
