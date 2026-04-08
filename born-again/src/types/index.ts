export interface PlanSection {
    day: number
    title: string
    book: string
    chapter: number
    verse_start: number
    verse_end: number
}

export interface PlanRow {
    id: number
    day_number: number
    title: string
    book: string
    chapter: number
    verse_start: number
    verse_end: number
    summary: string
    commentary: string
}

export interface Verse {
    number: number
    text: string
}

export interface Favorite {
    id: string
    user_id: string
    book: string
    chapter: number
    verse: number
    verse_text: string
    created_at: string
}

export interface ProgressRow {
    plan_id: number
}

export interface WEBVerse {
    type: string
    chapterNumber?: number
    verseNumber?: number
    sectionNumber?: number
    value?: string
}