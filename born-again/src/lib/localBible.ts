import type {Verse, WEBVerse} from "../types";
import johnRaw from '../content/bible/John.json'
import matthewRaw from '../content/bible/Matthew.json'
import markRaw from '../content/bible/Mark.json'
import lukeRaw from '../content/bible/Luke.json'
import actsRaw from '../content/bible/Acts.json'
import romansRaw from '../content/bible/Romans.json'
import galatiansRaw from '../content/bible/Galatians.json'

const BOOK_DATA: Record<string, WEBVerse[]> = {
    JHN: johnRaw as WEBVerse[],
    MAT: matthewRaw as WEBVerse[],
    MRK: markRaw as WEBVerse[],
    LUK: lukeRaw as WEBVerse[],
    ACT: actsRaw as WEBVerse[],
    ROM: romansRaw as WEBVerse[],
    GAL: galatiansRaw as WEBVerse[],
}

export function getPassage(
    book: string,
    chapter: number,
    verseStart: number,
    verseEnd: number
): Verse[] {
    const raw = BOOK_DATA[book]
    if (!raw) {
        console.error(`Unknown book: ${book}`)
        return []
    }

    return raw
        .filter(
            entry =>
                entry.type === 'paragraph text' &&
                entry.chapterNumber === chapter &&
                entry.verseNumber !== undefined &&
                entry.verseNumber >= verseStart &&
                entry.verseNumber <= verseEnd
        )
        .map(entry => ({
            number: entry.verseNumber!,
            text: entry.value?.trim() ?? ''
        }))
}

export function getVerseText(
    book: string,
    chapter: number,
    verse: number
): string {
    return getPassage(book, chapter, verse, verse)[0]?.text ?? ''
}

export function estimateReadTime(
    book: string,
    chapter: number,
    verseStart: number,
    verseEnd: number
): number {
    const verses = getPassage(book, chapter, verseStart, verseEnd)
    const wordCount = verses.reduce(
        (acc, v) => acc + v.text.split(' ').length,
        0
    )

    return Math.max(1, Math.ceil(wordCount / 200))
}