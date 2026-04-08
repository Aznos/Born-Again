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
            const { error } = await supabase.from("favorites").insert({
                user_id: userId,
                ...verse
            })
            if (error) {
                console.error('[favorites] insert error:', error.code, error.message, error.details)
                if (error.code !== '23505') throw error
            }
        },
        onMutate: async (verse) => {
            await queryClient.cancelQueries({ queryKey: ["favorites", userId] })
            const previous = queryClient.getQueryData<Favorite[]>(["favorites", userId])
            const optimistic: Favorite = {
                id: `optimistic-${Date.now()}`,
                user_id: userId ?? '',
                created_at: new Date().toISOString(),
                ...verse
            }
            queryClient.setQueryData<Favorite[]>(["favorites", userId], old => [optimistic, ...(old ?? [])])
            return { previous }
        },
        onError: (_err, _verse, ctx) => {
            queryClient.setQueryData(["favorites", userId], ctx?.previous)
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ["favorites", userId] })
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
        onMutate: async ({ book, chapter, verse }) => {
            await queryClient.cancelQueries({ queryKey: ["favorites", userId] })
            const previous = queryClient.getQueryData<Favorite[]>(["favorites", userId])
            queryClient.setQueryData<Favorite[]>(["favorites", userId], old =>
                (old ?? []).filter(f => !(f.book === book && f.chapter === chapter && f.verse === verse))
            )
            return { previous }
        },
        onError: (_err, _vars, ctx) => {
            queryClient.setQueryData(["favorites", userId], ctx?.previous)
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ["favorites", userId] })
    })

    function isFavorited(book: string, chapter: number, verse: number) {
        return favorites.some(
            f => f.book === book && f.chapter === chapter && f.verse === verse
        )
    }

    return { favorites, addFavorite, removeFavorite, isFavorited }
}