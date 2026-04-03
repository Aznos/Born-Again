import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import type {Favorite} from "../types";
import {supabase} from "../lib/supabase.ts";

export function useFavorites(userId: string | undefined) {
    const queryClient = useQueryClient()

    const { data: favorites = [] } = useQuery<Favorite[]>({
        queryKey: ["favorites", userId],
        queryFn: async () => {
            const { data } = await supabase
                .from("favorites")
                .select('*')
                .eq("user_id", userId)
                .order("created_at", { ascending: false })
            return data ?? []
        },
        enabled: !!userId
    })

    const addFavorite = useMutation({
        mutationFn: async (verse: Omit<Favorite, "id" | "user_id" | "created_at">) => {
            await supabase.from("favorites").insert({
                user_id: userId,
                ...verse
            })
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favorites", userId] })
    })

    const removeFavorite = useMutation({
        mutationFn: async ({ book, chapter, verse }: {
            book: string
            chapter: number
            verse: number
        }) => {
            await supabase
                .from("favorites")
                .delete()
                .eq("user_id", userId)
                .eq("book", book)
                .eq("chapter", chapter)
                .eq("verse", verse)
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favorites", userId] })
    })

    function isFavorited(book: string, chapter: number, verse: number) {
        return favorites.some(
            f => f.book === book && f.chapter === chapter && f.verse === verse
        )
    }

    return { favorites, addFavorite, removeFavorite, isFavorited }
}