import {supabase} from "../lib/supabase.ts";
import {useQuery} from "@tanstack/react-query";
import type {PlanSection} from "../types";
import plan from "../content/plan.json"

export function useProgress(userId: string | undefined) {
    const { data: completedIds = [], isLoading } = useQuery<number[]>({
        queryKey: ['progress', userId],
        queryFn: async () => {
            const { data } = await supabase
                .from('progress')
                .select('plan_id')
                .eq('user_id', userId)
            return (data ?? []).map((r: { plan_id: number }) => r.plan_id)
        },
        enabled: !!userId
    })

    const completed = completedIds.length
    const total = plan.length
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0

    const nextSection: PlanSection | null =
        (plan as PlanSection[]).find(d => !completedIds.includes(d.day)) ?? null

    const recentlyCompleted: PlanSection[] = (plan as PlanSection[])
        .filter(d => completedIds.includes(d.day))
        .slice(-3)
        .reverse()

    function isCompleted(day: number) {
        return completedIds.includes(day)
    }

    return {
        completedIds,
        completed,
        total,
        percent,
        nextSection,
        recentlyCompleted,
        isCompleted,
        isLoading
    }
}