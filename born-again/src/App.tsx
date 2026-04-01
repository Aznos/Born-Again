import { useEffect, useState } from "react"
import {getPassage} from "./lib/bible.ts";

function App() {
    const [text, setText] = useState<string | null>(null)

    useEffect(() => {
        getPassage("JHN", 1, 3, 7).then(setText)
    }, [])

    return <>
        {text && <div className="text-4xl text-primary" dangerouslySetInnerHTML={{ __html: text }} />}
    </>
}

export default App
