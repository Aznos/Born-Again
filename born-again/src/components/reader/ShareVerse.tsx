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
        const text = `"${verseText}" - ${book} ${chapter}:${verseNumber} (WEB)`
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
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