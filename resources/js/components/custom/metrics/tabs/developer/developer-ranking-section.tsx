import CustomAvatar from '@/components/custom/custom-avatar';
import { SectionTitle } from '@/components/custom/metrics';
import { Card, CardContent } from '@/components/ui/card';
import type { DeveloperRankingRow } from '@/types/metric';

interface DeveloperRankingSectionProps {
    ranking: DeveloperRankingRow[];
}

export default function DeveloperRankingSection({
    ranking,
}: DeveloperRankingSectionProps) {
    return (
        <>
            <SectionTitle title="🏆 Developer Ranking" className="mt-6" />
            <Card className="overflow-hidden border-0 py-0 shadow-md">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b bg-gray-50">
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                                        Developer
                                    </th>
                                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">
                                        Commits
                                    </th>
                                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">
                                        PRs
                                    </th>
                                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">
                                        Reviews
                                    </th>
                                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">
                                        Issues
                                    </th>
                                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">
                                        Tasks
                                    </th>
                                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">
                                        Projects
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {ranking.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="py-8 text-center text-gray-400"
                                        >
                                            No developers found
                                        </td>
                                    </tr>
                                ) : (
                                    ranking.map((dev) => (
                                        <tr
                                            key={dev.id}
                                            className="border-b last:border-0 hover:bg-gray-50"
                                        >
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <CustomAvatar
                                                        src={
                                                            dev.avatar ??
                                                            undefined
                                                        }
                                                        title={dev.name
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                        className="h-8 w-8"
                                                    />
                                                    <div>
                                                        <p className="text-sm font-medium">
                                                            {dev.name}
                                                        </p>
                                                        <p className="text-xs text-gray-400">
                                                            @{dev.username}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {dev.commits}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {dev.prs}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {dev.reviews}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {dev.issues}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className="font-medium">
                                                    {dev.tasks_total}
                                                </span>
                                                <span className="ml-1 text-xs text-gray-400">
                                                    ({dev.tasks_open} open)
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {dev.projects}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
