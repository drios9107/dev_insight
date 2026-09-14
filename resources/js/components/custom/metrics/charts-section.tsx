import CardSectionWrapper from "./section-components/card-section-wrapper"
import { CommitByDay, DaysWithoutCommit } from "@/types/metric";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import moment from 'moment';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMemo } from "react";

interface IChartsSection {
    commits_by_day: CommitByDay[];
    days_without_commit: DaysWithoutCommit[];
}

const ChartsSection = ({ days_without_commit = [], commits_by_day = [] }: IChartsSection) => {
    const maxDays = useMemo(() => Math.max(1, ...days_without_commit.map((d) => d.days_without_commit)), [days_without_commit])

    return <CardSectionWrapper className="lg:grid-cols-2 gap-6">
        {/* Commits per day chart (keep as is) */}
        <Card className="border-0 shadow-md overflow-hidden">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-gray-700">
                    Commits per Day (30 days)
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
                <div className="h-32 w-full overflow-visible">
                    {commits_by_day.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                            No commits found
                        </div>
                    ) : (
                        <>
                            <div className="h-32 w-full flex items-end gap-1">
                                {commits_by_day.map((item) => {
                                    const max = Math.max(1, ...commits_by_day.map((c) => c.count));
                                    const height = Math.max(4, (item.count / max) * 100);
                                    const date = moment(item.date);

                                    return (
                                        <div
                                            key={item.date}
                                            className="flex-1 h-full flex items-end group relative"
                                        >
                                            {/* Tooltip original */}
                                            <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap pointer-events-none z-10">
                                                {item.count} commits
                                                <br />
                                                {date.format('YYYY/MM/DD')}
                                            </div>

                                            {/* Barra */}
                                            <div
                                                className="w-full bg-gradient-to-t from-blue-400 to-blue-500 rounded-t transition-all duration-300 hover:from-blue-500 hover:to-blue-600"
                                                style={{ height: `${height}%` }}
                                            />
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="flex gap-1 mt-2">
                                {commits_by_day.map((item) => (
                                    <div
                                        key={item.date}
                                        className="flex-1 flex justify-center relative h-6"
                                    >
                                        <span className="absolute text-[10px] text-gray-400 transform -rotate-45 origin-top-left translate-y-3 whitespace-nowrap">
                                            {moment(item.date).format('DD/MM')}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </>)}
                </div>
            </CardContent>
        </Card>

        {/* Days Without Commit */}
        <Card className="border-0 shadow-md">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-gray-700">
                    📅 Days Without Commit (30 days)
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
                {days_without_commit.length === 0 ? (
                    <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
                        No data available
                    </div>
                ) : (
                    <div className="space-y-2">
                        {days_without_commit.map((item, index) => {
                            const percentage = (item.days_without_commit / maxDays) * 100;
                            const color =
                                item.days_without_commit === 0 ? 'from-green-400 to-green-500' :
                                    item.days_without_commit <= 3 ? 'from-blue-400 to-blue-500' :
                                        item.days_without_commit <= 7 ? 'from-yellow-400 to-yellow-500' :
                                            'from-red-400 to-red-500';

                            return (
                                <div key={index} className="flex items-center gap-2">
                                    <div className="w-24 flex items-center gap-1 flex-shrink-0">
                                        <Avatar className="w-5 h-5">
                                            <AvatarImage src={item.avatar || undefined} />
                                            <AvatarFallback className="text-[10px]">
                                                {item.name.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="text-xs text-gray-600 truncate">
                                            {item.username}
                                        </span>
                                    </div>
                                    <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-500 flex items-center justify-end pr-1`}
                                            style={{ width: `${Math.max(8, percentage)}%` }}
                                        >
                                            <span className="text-[10px] font-bold text-white">
                                                {item.days_without_commit === 999 ? '∞' : `${item.days_without_commit}d`}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    </CardSectionWrapper>
}

export default ChartsSection