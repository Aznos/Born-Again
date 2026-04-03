import {useNavigate, useParams} from "react-router-dom";
import BackButton from "../components/BackButton.tsx";
import {useAuth} from "../hooks/useAuth.ts";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useState} from "react";
import plan from "../content/plan.json"
import {supabase} from "../lib/supabase.ts";
import {getPassage} from "../lib/bible.ts";
import {useFavorites} from "../hooks/useFavorites.ts";

type Layer = "summary" | "scripture" | "commentary"

export default function Reader() {
    const { day } = useParams<{ day: string }>()
    const navigate = useNavigate()
    const { user } = useAuth()
    const queryClient = useQueryClient()
    const [layer, setLayer] = useState<Layer>("summary")

    const section = plan.find(d => d.day === parseInt(day ?? '1'))
    const { favorites, addFavorite, removeFavorite, isFavorited } = useFavorites(user?.id)

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

    const { data: verses = [] } = useQuery({
        queryKey: ['passage', day],
        queryFn: () => getPassage(
            section!.book,
            section!.chapter,
            section!.verse_start,
            section!.verse_end
        ),
        enabled: !!section
    })

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

    if (!section || !planData) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <span className="loading loading-spinner loading-md text-primary" />
            </div>
        )
    }

    const layers: Layer[] = ["summary", "scripture", "commentary"]

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
                {section.book} {section.chapter}:{section.verse_start}–{section.verse_end} · WEB
            </p>

            <div role="tablist" className="tabs tabs-boxed w-fit mb-8">
                {layers.map(l => (
                    <button
                        key={l}
                        role="tab"
                        onClick={() => setLayer(l)}
                        className={`tab capitalize ${layer === l ? 'tab-active' : ''}`}
                    >
                        {l}
                    </button>
                ))}
            </div>

            {layer === 'summary' && (
                <p className="text-base-content/80 leading-relaxed text-base">
                    {planData.summary}
                </p>
            )}

            {layer === 'scripture' && (
                <div className="flex flex-col gap-3">
                    {verses.length === 0 && (
                        <span className="loading loading-spinner loading-sm" />
                    )}
                    {verses.map(v => {
                        const fav = isFavorited(section.book, section.chapter, v.number)
                        return (
                            <div
                                key={v.number}
                                onClick={() => handleVerseTap(v.number, v.text)}
                                className={`flex gap-3 p-3 rounded-lg cursor-pointer transition-colors group
                                            ${fav ? 'bg-primary/10 border border-primary/30' : 'hover:bg-base-200'}`}
                            >
                    <span className="text-xs text-base-content/30 mt-1 w-5 shrink-0 font-mono">
                      {v.number}
                    </span>
                    <p className="text-base-content/80 leading-relaxed text-base flex-1">
                        {v.text}
                    </p>
                    <span className={`text-lg shrink-0 transition-opacity
                                    ${fav ? 'opacity-100' : 'opacity-0 group-hover:opacity-30'}`}>
                      ♥
                    </span>
                </div>
                    )
                    })}
                    {verses.length > 0 && (
                        <p className="text-xs text-base-content/20 mt-2 text-center">
                            Tap a verse to save it to favorites
                        </p>
                    )}
                </div>
            )}

            {layer === 'commentary' && (
                <p className="text-base-content/80 leading-relaxed text-base">
                    {planData.commentary}
                </p>
            )}

            <div className="mt-12">
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
                    <div className="alert alert-success">
                        <span>✓ You completed this section</span>
                    </div>
                )}
            </div>
        </div>
    )
}
