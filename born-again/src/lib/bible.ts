const BIBLE_ID = "78a9f6124f344018-01"
const BASE = "/bible-api/v1"

export async function getPassage(book: string, chapter: number, verseStart: number, verseEnd: number) {
    const passage = `${book}.${chapter}.${verseStart}-${book}.${chapter}.${verseEnd}`
    const url = `${BASE}/bibles/${BIBLE_ID}/passages/${passage}?content-type=html&include-verse-numbers=true`
    const res = await fetch(url)

    if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        console.error("Bible API error:", res.status, err)
        throw new Error(`Bible API ${res.status}`)
    }
    const data = await res.json()
    return data.data.content as string
}