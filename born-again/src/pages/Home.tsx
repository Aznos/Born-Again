import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import SEO from "../components/SEO.tsx";

const features = [
    {
        title: 'Start in John',
        description: 'We begin where Jesus is most clearly revealed - the Gospel of John, then move through Matthew, Mark, Luke, and beyond.'
    },
    {
        title: 'Three layers',
        description: 'Every section has a plain English summary, the actual scripture, and a deeper commentary. Read at the level that fits you.'
    },
    {
        title: 'Save verses',
        description: 'Tap any verse to save it. Your favorites build into a personal library of scripture that has meant something to you.'
    },
    {
        title: 'No pressure',
        description: 'No streaks. No XP. No punishment for missing a day. Go at your own pace - the reading plan waits for you.'
    }
]

export default function Home() {
    const { user, loading } = useAuth()

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <span className="loading loading-spinner loading-lg" />
        </div>
    )

    if (user) return <Navigate to="/dashboard" replace />

    return (
        <><SEO/>
            <div className="max-w-2xl mx-auto px-6 py-20 flex flex-col items-center text-center">
                <div className="badge badge-outline badge-primary mb-6">Free · Open source · Always</div>

                <h1 className="text-5xl font-bold leading-tight mb-4">
                    Read the Bible.<br/>Actually understand it.
                </h1>

                <p className="text-base-content/50 text-lg leading-relaxed mb-10 max-w-lg">
                    Born Again walks you through scripture section by section with plain English summaries, the actual
                    text, and commentary that makes it make sense. For new believers and lifelong ones.
                </p>

                <div className="flex gap-3 mb-20">
                    <Link to="/signup" className="btn btn-primary btn-lg">
                        Start reading free
                    </Link>
                    <Link to="/login" className="btn btn-ghost btn-lg">
                        Sign in
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full text-left">
                    {features.map(f => (
                        <div key={f.title} className="card bg-base-200 border border-base-300">
                            <div className="card-body py-5 px-6">
                                <h3 className="font-semibold text-base mb-1">{f.title}</h3>
                                <p className="text-base-content/50 text-sm leading-relaxed">
                                    {f.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <p className="text-base-content/20 text-xs mt-16">
                    Scripture from the World English Bible (WEB) - public domain.
                </p>
            </div>
        </>
    )
}