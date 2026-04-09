import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useProgress } from '../hooks/useProgress'
import { estimateReadTime } from '../lib/localBible'
import plan from '../content/plan.json'
import type { PlanSection } from '../types'
import BackButton from "../components/BackButton.tsx";

const PHASE_LABELS: Record<number, string> = {
    1: 'John — The Word made flesh',
    6: 'John — Signs and confrontations',
    12: 'John — Bread of life',
    17: 'John — Light and darkness',
    20: 'John — I am statements',
    23: 'John — Death and life',
    27: 'John — The upper room',
}

export default function PlanOverview() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const { isCompleted, nextSection, completed, total } = useProgress(user?.id)

    return (
        <div className="max-w-2xl mx-auto px-6 py-12">
            <BackButton to={"/dashboard"} />

            <h1 className="text-2xl font-semibold mb-1">Reading plan</h1>
            <p className="text-base-content/40 text-sm mb-8">
                {completed} of {total} complete
            </p>

            <div className="flex flex-col gap-2">
                {(plan as PlanSection[]).map((section) => {
                    const done = isCompleted(section.day)
                    const isNext = nextSection?.day === section.day
                    const readTime = estimateReadTime(
                        section.book,
                        section.chapter,
                        section.verse_start,
                        section.verse_end
                    )
                    const phaseLabel = PHASE_LABELS[section.day]

                    return (
                        <div key={section.day}>
                            {phaseLabel && (
                                <p className="text-xs text-base-content/30 font-mono uppercase tracking-wider mt-6 mb-2 first:mt-0">
                                    {phaseLabel}
                                </p>
                            )}
                            <div
                                onClick={() => navigate(`/read/${section.day}`)}
                                className={`card border cursor-pointer transition-colors
                  ${done
                                    ? 'bg-base-200 border-base-300 opacity-60 hover:opacity-100'
                                    : isNext
                                        ? 'bg-base-200 border-primary/40 hover:border-primary/70'
                                        : 'bg-base-200 border-base-300 hover:border-base-content/20'
                                }`}
                            >
                                <div className="card-body py-3 px-5 flex-row items-center gap-4">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs
                    ${done
                                        ? 'bg-success/20 text-success'
                                        : isNext
                                            ? 'bg-primary/20 text-primary'
                                            : 'bg-base-300 text-base-content/20'
                                    }`}>
                                        {done ? '✓' : section.day}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-medium truncate
                      ${isNext ? 'text-base-content' : 'text-base-content/70'}`}>
                                            {section.title}
                                        </p>
                                        <p className="text-xs text-base-content/30 font-mono mt-0.5">
                                            {section.book} {section.chapter}:{section.verse_start}–{section.verse_end}
                                            {' · '}{readTime} min
                                        </p>
                                    </div>
                                    {isNext && (
                                        <div className="badge badge-primary badge-sm badge-outline shrink-0">
                                            up next
                                        </div>
                                    )}
                                    {!done && !isNext && (
                                        <span className="text-base-content/20 text-sm shrink-0">→</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}