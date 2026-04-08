import {useAuth} from "../hooks/useAuth.ts";
import {useFavorites} from "../hooks/useFavorites.ts";
import BackButton from "../components/BackButton.tsx";
import ShareVerse from "../components/reader/ShareVerse.tsx";

export default function Favorites() {
    const { user } = useAuth()
const { favorites, removeFavorite } = useFavorites(user?.id)

    const grouped = favorites.reduce<Record<string, typeof favorites>>((acc, fav) => {
        const key = `${fav.book} ${fav.chapter}`
        if(!acc[key]) acc[key] = []
        acc[key].push(fav)

        return acc
    }, {})

    return (
        <div className={"min-h-screen max-w-2xl mx-auto px-6 py-12"}>
            <BackButton to="/dashboard" />

            <h1 className={"text-3xl font-semibold mb-1"}>Favorites</h1>
            <p className={"text-base-content/40 text-sm mb-8"}>
                {favorites.length} saved {favorites.length === 1 ? "verse" : "verses"}
            </p>

            {favorites.length === 0 && (
                <div className={"text-center py-20 text-base-content/30"}>
                    <p className={"text-lg mb-2"}>No favorites yet</p>
                    <p className={"text-sm"}>Tap on any verse in the scripture view to save it</p>
                </div>
            )}

            <div className={"flex flex-col gap-6"}>
                {Object.entries(grouped).map(([group, verses]) => (
                    <div key={group}>
                        <p className={"text-sm text-base-content/30 font-mono uppercase tracking-wider mb-3"}>
                            {group}
                        </p>
                        <div className={"flex flex-col gap-2"}>
                            {verses.map(fav => (
                                <div className={"card bg-base-200 border border-base-300"} key={fav.id}>
                                    <div className={"card-body py-4 px-6 flex-row items-start gap-4"}>
                                        <span className={"text-sm text-base-content/30 font-mono mt-1 w-5 shrink-0"}>
                                            {fav.verse}
                                        </span>
                                        <p className={"text-base-content/80 leading-relaxed flex-1 text-sm"}>
                                            {fav.verse_text}
                                        </p>
                                        <ShareVerse
                                            book={fav.book}
                                            chapter={fav.chapter}
                                            verseNumber={fav.verse}
                                            verseText={fav.verse_text}
                                        />
                                        <button
                                            onClick={() => removeFavorite.mutate({
                                                book: fav.book,
                                                chapter: fav.chapter,
                                                verse: fav.verse
                                            })}
                                            className={"btn btn-ghost btn-xs text-base-content/20 hover:text-error shrink-0"}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}