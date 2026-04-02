import {useNavigate, useParams} from "react-router-dom";
import {useAuth} from "../hooks/useAuth.ts";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useState} from "react";
import plan from "../content/plan.json"
import {supabase} from "../lib/supabase.ts";
import {getPassage} from "../lib/bible.ts";

export default function Reader() {
    const { day } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()
    const queryClient = useQueryClient()
    const [layer, setLayer] = useState("summary")

    const section = plan.find(d => d.day === parseInt(day!))

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

    const { data: passage } = useQuery({
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
            // @ts-ignore
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
                // @ts-ignore
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

    if (!section || !planData) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <span className="loading loading-spinner loading-md text-primary" />
            </div>
        )
    }

    const layers = ['summary', 'scripture', 'commentary']

    return (
        <div className="min-h-screen bg-base-200">
            <div className="max-w-2xl mx-auto px-6 py-12">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="btn btn-ghost btn-sm mb-10"
                >
                    ← Back
                </button>

                <div className="badge badge-primary badge-outline text-xs font-medium uppercase tracking-wider mb-2">
                    Day {section.day}
                </div>
                <h1 className="text-2xl font-semibold text-base-content mb-1">{planData.title}</h1>
                <p className="text-base-content/50 text-sm mb-8">
                    {section.book} {section.chapter}:{section.verse_start}–{section.verse_end} · WEB
                </p>

                <div role="tablist" className="tabs tabs-box mb-8 w-fit">
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

                <div className="text-base-content/80 leading-relaxed text-base">
                    {layer === 'summary' && (
                        <p>{planData.summary}</p>
                    )}

                    {layer === 'scripture' && (
                        passage
                            ? <div
                                className="leading-loose
                                    [&_.s1]:block [&_.s1]:text-base [&_.s1]:font-semibold [&_.s1]:text-base-content [&_.s1]:mt-6 [&_.s1]:mb-1 [&_.s1]:italic
                                    [&_.s2]:block [&_.s2]:text-sm [&_.s2]:font-semibold [&_.s2]:text-base-content [&_.s2]:mt-4 [&_.s2]:mb-1
                                    [&_.v]:text-xs [&_.v]:align-super [&_.v]:text-base-content/40 [&_.v]:font-medium [&_.v]:mr-0.5"
                                dangerouslySetInnerHTML={{ __html: passage }}
                              />
                            : <span className="loading loading-dots loading-sm" />
                    )}

                    {layer === 'commentary' && (
                        <p>{planData.commentary}</p>
                    )}
                </div>

                <div className="mt-12">
                    {isCompleted ? (
                        <p className="text-center text-base-content/40 text-sm">✓ Completed</p>
                    ) : (
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
                    )}
                </div>
            </div>
        </div>
    )
}
