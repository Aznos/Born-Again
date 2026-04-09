import {useState} from "react";

interface ShareVerseProps {
    book: string
    chapter: number
    verseNumber: number
    verseText: string
}

export default function ShareVerse({
    book,
    chapter,
    verseNumber,
    verseText

}: ShareVerseProps) {
    const [copied, setCopied] = useState(false)

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(`"${verseText}" - ${book} ${chapter}:${verseNumber} (WEB)`)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch {
            // clipboard not available — silently ignore
        }
    }

    return (
        <button
            onClick={e => {
                e.stopPropagation()
                handleCopy()
            }}
            className={"btn btn-ghost btn-md text-lg text-base-content/20 hover:text-base-content/60 shrink-0"}
            title={"Copy verse"}
        >{copied ? '✓' : '⎘'}</button>
    )
}