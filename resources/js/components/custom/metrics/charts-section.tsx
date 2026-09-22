import moment from 'moment';
import { useMemo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { CommitByDay, DaysWithoutCommit } from '@/types/metric';
import CardSectionWrapper from './section-components/card-section-wrapper';

interface IChartsSection {
    commits_by_day: CommitByDay[];
    days_without_commit: DaysWithoutCommit[];
}

const ChartsSection = ({
    days_without_commit = [],
    commits_by_day = [],
}: IChartsSection) => {
    const maxDays = useMemo(
        () =>
            Math.max(
                1,
                ...days_without_commit.map((d) => d.days_without_commit),
            ),
        [days_without_commit],
    );

    return (
        <CardSectionWrapper className="gap-6 lg:grid-cols-2">
            {/* Commits per day chart (keep as is) */}
            <Card className="overflow-hidden border-0 shadow-md">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold text-gray-700">
                        Commits per Day (30 days)
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="h-32 w-full overflow-visible">
                        {commits_by_day.length === 0 ? (
                            <div className="flex h-full items-center justify-center text-sm text-gray-400">
                                No commits found
                            </div>
                        ) : (
                            <>
                                <div className="flex h-32 w-full items-end gap-1">
                                    {commits_by_day.map((item) => {
                                        const max = Math.max(
                                            1,
                                            ...commits_by_day.map(
                                                (c) => c.count,
                                            ),
                                        );
                                        const height = Math.max(
                                            4,
                                            (item.count / max) * 100,
                                        );
                                        const date = moment(item.date);

                                        return (
                                            <div
                                                key={item.date}
                                                className="group relative flex h-full flex-1 items-end"
                                            >
                                                {/* Tooltip */}
                                                <div className="pointer-events-none absolute bottom-full z-10 mb-1 rounded bg-gray-800 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                                    {item.count} commits
                                                    <br />
                                                    {date.format('YYYY/MM/DD')}
                                                </div>

                                                {/* Bar */}
                                                <div
                                                    className="w-full rounded-t bg-gradient-to-t from-blue-400 to-blue-500 transition-all duration-300 hover:from-blue-500 hover:to-blue-600"
                                                    style={{
                                                        height: `${height}%`,
                                                    }}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="mt-2 flex gap-1">
                                    {commits_by_day.map((item) => (
                                        <div
                                            key={item.date}
                                            className="relative flex h-6 flex-1 justify-center"
                                        >
                                            <span className="absolute origin-top-left translate-y-3 -rotate-45 transform text-[10px] whitespace-nowrap text-gray-400">
                                                {moment(item.date).format(
                                                    'DD/MM',
                                                )}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
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
                        <div className="flex h-32 items-center justify-center text-sm text-gray-400">
                            No data available
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {days_without_commit.map((item, index) => {
                                const percentage =
                                    (item.days_without_commit / maxDays) * 100;
                                const color =
                                    item.days_without_commit === 0
                                        ? 'from-green-400 to-green-500'
                                        : item.days_without_commit <= 3
                                          ? 'from-blue-400 to-blue-500'
                                          : item.days_without_commit <= 7
                                            ? 'from-yellow-400 to-yellow-500'
                                            : 'from-red-400 to-red-500';

                                return (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2"
                                    >
                                        <div className="flex w-24 flex-shrink-0 items-center gap-1">
                                            <Avatar className="h-5 w-5">
                                                <AvatarImage
                                                    src={
                                                        item.avatar || undefined
                                                    }
                                                />
                                                <AvatarFallback className="text-[10px]">
                                                    {item.name
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="truncate text-xs text-gray-600">
                                                {item.username}
                                            </span>
                                        </div>
                                        <div className="h-5 flex-1 overflow-hidden rounded-full bg-gray-100">
                                            <div
                                                className={`h-full bg-gradient-to-r ${color} flex items-center justify-end rounded-full pr-1 transition-all duration-500`}
                                                style={{
                                                    width: `${Math.max(8, percentage)}%`,
                                                }}
                                            >
                                                <span className="text-[10px] font-bold text-white">
                                                    {item.days_without_commit ===
                                                    999
                                                        ? '∞'
                                                        : `${item.days_without_commit}d`}
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
    );
};

export default ChartsSection;
