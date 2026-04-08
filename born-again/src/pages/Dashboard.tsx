import {useAuth} from "../hooks/useAuth.ts";
import {Link, useNavigate} from "react-router-dom";
import {useProgress} from "../hooks/useProgress.ts";

export default function Dashboard() {
    const { user } = useAuth()
    const navigate = useNavigate();
    const {
        completed,
        total,
        percent,
        nextSection,
        recentlyCompleted,
        isLoading
    } = useProgress(user?.id)

    if(isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-spinner loading-lg" />
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto px-6 py-12">

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-semibold">Your reading</h1>
                    <p className="text-base-content/40 text-sm mt-1">
                        {completed} of {total} sections complete
                    </p>
                </div>
                <Link to="/favorites" className="btn btn-ghost btn-sm gap-1">
                    <span>♥</span> Favorites
                </Link>
            </div>

            <div className="card bg-base-200 border border-base-300 mb-6">
                <div className="card-body py-4 px-5">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-base-content/40">Progress</span>
                        <span className="text-base-content/40 font-mono">{percent}%</span>
                    </div>
                    <progress
                        className="progress progress-primary w-full"
                        value={completed}
                        max={total}
                    />
                </div>
            </div>

            {nextSection ? (
                <div>
                    <p className="text-xs text-base-content/30 font-mono uppercase tracking-wider mb-3">
                        Up next
                    </p>
                    <div
                        onClick={() => navigate(`/read/${nextSection.day}`)}
                        className="card bg-base-200 border border-primary/30 hover:border-primary/60 cursor-pointer transition-colors mb-8"
                    >
                        <div className="card-body py-5 px-6">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <div className="badge badge-primary badge-outline badge-sm mb-2">
                                        Day {nextSection.day}
                                    </div>
                                    <h2 className="text-lg font-medium mb-1">{nextSection.title}</h2>
                                    <p className="text-base-content/40 text-sm font-mono">
                                        {nextSection.book} {nextSection.chapter}:{nextSection.verse_start}–{nextSection.verse_end}
                                    </p>
                                </div>
                                <span className="text-2xl text-base-content/20 mt-1">→</span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="alert alert-success mb-8">
                    <span>🎉 You've completed all available sections. More coming soon.</span>
                </div>
            )}

            <div className="flex justify-end mb-6 -mt-4">
                <Link to="/plan" className="btn btn-ghost btn-xs text-base-content/30">
                    View full plan →
                </Link>
            </div>

            {recentlyCompleted.length > 0 && (
                <div>
                    <p className="text-xs text-base-content/30 font-mono uppercase tracking-wider mb-3">
                        Recently completed
                    </p>
                    <div className="flex flex-col gap-2">
                        {recentlyCompleted.map(section => (
                            <div
                                key={section.day}
                                onClick={() => navigate(`/read/${section.day}`)}
                                className="card bg-base-200 border border-base-300 hover:border-base-content/20 cursor-pointer transition-colors"
                            >
                                <div className="card-body py-3 px-5 flex-row items-center gap-4">
                                    <span className="text-success text-base">✓</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{section.title}</p>
                                        <p className="text-xs text-base-content/30 font-mono mt-0.5">
                                            Day {section.day} · {section.book} {section.chapter}
                                        </p>
                                    </div>
                                    <span className="text-base-content/20 text-sm">→</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
