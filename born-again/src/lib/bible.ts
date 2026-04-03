import type {Verse} from "../types";

const BIBLE_ID = "78a9f6124f344018-01"
const BASE = "/bible-api/v1"

export async function getPassage(book: string, chapter: number, verseStart: number, verseEnd: number): Promise<Verse[]> {
    const passage = `${book}.${chapter}.${verseStart}-${book}.${chapter}.${verseEnd}`
    const url = `${BASE}/bibles/${BIBLE_ID}/passages/${passage}?content-type=html&include-verse-numbers=true`
    const res = await fetch(url)

    if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        console.error("Bible API error:", res.status, err)
        throw new Error(`Bible API ${res.status}`)
    }

    const data = await res.json()

    const raw: string = data.data.content
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()

    const verses: Verse[] = []
    const parts = raw.split(/(\[\d+])/).filter(Boolean)

    let currentNumber: number | null = null
    for(const part of parts) {
        const match = part.match(/^\[(\d+)]$/)
        if(match) {
            currentNumber = parseInt(match[1])
        } else if(currentNumber !== null) {
            verses.push({ number: currentNumber, text: part.trim() })
            currentNumber = null
        }
    }

    return verses
}