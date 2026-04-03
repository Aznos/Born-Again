import {useAuth} from "../hooks/useAuth.ts";
import {Link, useNavigate} from "react-router-dom";
import {supabase} from "../lib/supabase.ts";
import {useQuery} from "@tanstack/react-query";
import plan from "../content/plan.json"

export default function Dashboard() {
    const { user } = useAuth()
    const navigate = useNavigate();

    const { data: completedIds } = useQuery({
        queryKey: ['progress', user?.id],
        queryFn: async () => {
            const { data } = await supabase
                .from('progress')
                .select('plan_id')
                .eq('user_id', user.id)
            // @ts-ignore
            return data.map(r => r.plan_id)
        },
        enabled: !!user
    })

    const completed = completedIds?.length ?? 0
    const total = plan.length
    const nextDay = plan.find(d => !completedIds?.includes(d.day)) ?? plan[0]

    async function handleSignOut() {
        await supabase.auth.signOut()
        navigate("/login")
    }

    return (
        <div className="min-h-screen bg-base-200">
            <div className="max-w-xl mx-auto px-6 py-12">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-semibold text-base-content">Your reading</h1>
                        <p className="text-base-content/50 text-sm mt-1">{completed} of {total} sections complete</p>
                    </div>
                    <button onClick={handleSignOut} className="btn btn-ghost btn-sm">
                        Sign out
                    </button>
                </div>

                <progress
                    className="progress progress-primary w-full mb-10"
                    value={completed}
                    max={total}
                />

                <div className={"flex justify-end mb-6"}>
                    <Link to={"/favorites"} className={"btn btn-ghost btn-sm text-base-content/40"}>
                        ♥ Favorites
                    </Link>
                </div>

                {nextDay && (
                    <div
                        onClick={() => navigate(`/read/${nextDay.day}`)}
                        className="card bg-base-100 shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                    >
                        <div className="card-body">
                            <div className="badge badge-primary badge-outline text-xs font-medium uppercase tracking-wider mb-1">
                                Day {nextDay.day}
                            </div>
                            <h2 className="card-title text-base-content">{nextDay.title}</h2>
                            <p className="text-base-content/50 text-sm">
                                {nextDay.book} {nextDay.chapter}:{nextDay.verse_start}–{nextDay.verse_end}
                            </p>
                            <div className="card-actions justify-end mt-2">
                                <button className="btn btn-primary btn-sm">Begin reading →</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
