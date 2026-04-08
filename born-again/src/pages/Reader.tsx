import {useNavigate, useParams} from "react-router-dom";
import BackButton from "../components/BackButton.tsx";
import {useAuth} from "../hooks/useAuth.ts";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useEffect, useRef, useState} from "react";
import plan from "../content/plan.json"
import {supabase} from "../lib/supabase.ts";
import {getPassage, estimateReadTime} from "../lib/localBible.ts";
import {useFavorites} from "../hooks/useFavorites.ts";
import ShareVerse from "../components/reader/ShareVerse.tsx";


export default function Reader() {
    const { day } = useParams<{ day: string }>()
    const navigate = useNavigate()
    const { user } = useAuth()
    const queryClient = useQueryClient()
    const [step, setStep] = useState<"scripture" | "reflection">("scripture")
    const [showCommentary, setShowCommentary] = useState(false)
    const [isSpeaking, setIsSpeaking] = useState(false)
    const [speakingVerse, setSpeakingVerse] = useState<number | null>(null)
    const verseIndexRef = useRef(0)
    const verseElsRef = useRef<Record<number, HTMLDivElement | null>>({})

    const section = plan.find(d => d.day === parseInt(day ?? '1'))
    const { addFavorite, removeFavorite, isFavorited } = useFavorites(user?.id)

    const { data: planData } = useQuery({
        queryKey: ['plan', day],
        queryFn: async () => {
            const {data} = await supabase
                .from('reading_plan')
                .select('*')
                .eq('day_number', day)
                .single()
            return data
        }
    })

    const verses = section
        ? getPassage(section.book, section.chapter, section.verse_start, section.verse_end)
        : []

    const readTime = section
        ? estimateReadTime(section.book, section.chapter, section.verse_start, section.verse_end)
        : 1

    const { data: isCompleted } = useQuery({
        queryKey: ['completed', day, user?.id],
        queryFn: async () => {
            const { data } = await supabase
                .from('progress')
                .select('id')
                .eq('user_id', user!.id)
                .eq('plan_id', parseInt(day!))
                .maybeSingle()
            return !!data
        },
        enabled: !!user
    })

    const completeMutation = useMutation({
        mutationFn: async () => {
            await supabase.from('progress').insert({
                user_id: user!.id,
                plan_id: parseInt(day!)
            })
        },
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['progress'] })
            void queryClient.invalidateQueries({ queryKey: ['completed', day] })
            navigate('/dashboard')
        }
    })

    function handleVerseTap(verseNumber: number, verseText: string) {
        if(!section || !user) return

        const alreadyFav = isFavorited(section.book, section.chapter, verseNumber)
        if(alreadyFav) {
            removeFavorite.mutate({
                book: section.book,
                chapter: section.chapter,
                verse: verseNumber
            })
        } else {
            addFavorite.mutate({
                book: section.book,
                chapter: section.chapter,
                verse: verseNumber,
                verse_text: verseText
            })
        }
    }

    function getBestVoice(): SpeechSynthesisVoice | null {
        const voices = window.speechSynthesis.getVoices()
        const preferred = ['Samantha', 'Google US English', 'Google UK English Female', 'Microsoft Aria', 'Karen', 'Moira']
        for (const name of preferred) {
            const match = voices.find(v => v.name.includes(name))
            if (match) return match
        }
        return voices.find(v => v.lang.startsWith('en')) ?? null
    }

    function speakFrom(index: number) {
        if (index >= verses.length) {
            setIsSpeaking(false)
            setSpeakingVerse(null)
            return
        }
        const v = verses[index]
        setSpeakingVerse(v.number)
        verseIndexRef.current = index
        const utterance = new SpeechSynthesisUtterance(v.text)
        utterance.voice = getBestVoice()
        utterance.rate = 0.88
        utterance.pitch = 1.0
        utterance.onend = () => setTimeout(() => speakFrom(index + 1), 350)
        utterance.onerror = () => {
            setIsSpeaking(false)
            setSpeakingVerse(null)
        }
        window.speechSynthesis.speak(utterance)
    }

    function startTTS() {
        window.speechSynthesis.cancel()
        setIsSpeaking(true)
        speakFrom(0)
    }

    function stopTTS() {
        window.speechSynthesis.cancel()
        setIsSpeaking(false)
        setSpeakingVerse(null)
    }

    useEffect(() => {
        return () => { window.speechSynthesis.cancel() }
    }, [])

    useEffect(() => {
        if (speakingVerse !== null) {
            verseElsRef.current[speakingVerse]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
    }, [speakingVerse])

    if (!section || !planData) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <span className="loading loading-spinner loading-md text-primary" />
            </div>
        )
    }

    return (
        <div className="min-h-screen max-w-2xl mx-auto px-6 py-12">
            <div className="flex items-center justify-between mb-8">
                <BackButton to="/dashboard" />
                <div className="badge badge-primary badge-outline">
                    Day {section.day}
                </div>
            </div>
            <h1 className="text-3xl font-semibold mb-1">{planData.title}</h1>
            <p className="text-base-content/40 text-sm mb-8">
                {section.book} {section.chapter}:{section.verse_start}–{section.verse_end}
                {' · '}WEB
                {' · '}{readTime} min read
            </p>

            {step === 'scripture' && (
                <>
                    <div className="flex flex-col gap-3">
                        {verses.length === 0 && (
                            <span className="loading loading-spinner loading-sm" />
                        )}
                        {verses.length > 0 && (
                            <div className="flex justify-end mb-1">
                                <button
                                    onClick={isSpeaking ? stopTTS : startTTS}
                                    className={`btn btn-sm gap-2 ${isSpeaking ? 'btn-error btn-outline' : 'btn-ghost text-base-content/40'}`}
                                >
                                    {isSpeaking ? (
                                        <>
                                            <span className="inline-block w-2 h-2 rounded-sm bg-current" />
                                            Stop
                                        </>
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                                <path d="M6.3 2.84A1.5 1.5 0 0 0 4 4.11v11.78a1.5 1.5 0 0 0 2.3 1.27l9.344-5.891a1.5 1.5 0 0 0 0-2.538L6.3 2.84Z" />
                                            </svg>
                                            Listen
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                        {verses.map(v => {
                            const fav = isFavorited(section.book, section.chapter, v.number)
                            const speaking = speakingVerse === v.number
                            return (
                                <div
                                    key={v.number}
                                    ref={el => { verseElsRef.current[v.number] = el }}
                                    onClick={() => handleVerseTap(v.number, v.text)}
                                    className={`flex gap-3 p-3 rounded-lg cursor-pointer transition-colors group
                                                ${speaking ? 'bg-success/10 border border-success/40' : fav ? 'bg-primary/10 border border-primary/30' : 'hover:bg-base-200'}`}
                                >
                                    <span className="text-xs text-base-content/30 mt-1 w-5 shrink-0 font-mono flex flex-col items-center gap-1">
                                        {v.number}
                                        {speaking && (
                                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                                        )}
                                    </span>
                                    <p className={`leading-relaxed text-base flex-1 transition-colors ${speaking ? 'text-base-content' : 'text-base-content/80'}`}>
                                        {v.text}
                                    </p>
                                    <div className={"flex items-center gap-1 shrink-0"}>
                                        <ShareVerse book={section.book} chapter={section.chapter} verseNumber={v.number} verseText={v.text} />

                                        <span className={`text-lg shrink-0 transition-opacity
                                                    ${fav ? 'opacity-100' : 'opacity-0 group-hover:opacity-30'}`}>
                                        ♥
                                    </span>
                                    </div>
                                </div>
                            )
                        })}
                        {verses.length > 0 && (
                            <p className="text-xs text-base-content/20 mt-2 text-center">
                                Tap a verse to save it to favorites
                            </p>
                        )}
                    </div>

                    <div className="mt-12">
                        <button
                            onClick={() => setStep('reflection')}
                            className="btn btn-primary w-full"
                        >
                            Continue
                        </button>
                    </div>
                </>
            )}

            {step === 'reflection' && (
                <>
                    <div className="flex flex-col gap-6">
                        <p className="text-base-content/80 leading-relaxed text-base">
                            {planData.summary}
                        </p>

                        {planData.commentary && (
                            <div>
                                <button
                                    onClick={() => setShowCommentary(v => !v)}
                                    className="btn btn-ghost btn-sm px-0 text-base-content/50"
                                >
                                    {showCommentary ? 'Hide commentary' : 'Show commentary'}
                                </button>
                                {showCommentary && (
                                    <p className="mt-4 text-base-content/70 leading-relaxed text-base border-l-2 border-base-300 pl-4">
                                        {planData.commentary}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="mt-12 flex flex-col gap-3">
                        {!isCompleted ? (
                            <button
                                onClick={() => completeMutation.mutate()}
                                disabled={completeMutation.isPending}
                                className="btn btn-primary w-full"
                            >
                                {completeMutation.isPending
                                    ? <span className="loading loading-spinner loading-sm" />
                                    : 'Mark complete'
                                }
                            </button>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <div className="alert alert-success">
                                    <span>✓ You completed this section</span>
                                </div>
                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className="btn btn-ghost w-full"
                                >
                                    Back to dashboard
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}
