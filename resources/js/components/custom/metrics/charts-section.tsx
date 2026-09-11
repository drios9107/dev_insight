import CardSectionWrapper from "./card-section-wrapper"
import { CodeQualityMetrics, CommitByDay } from "@/types/metric";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import moment from 'moment';
import SingleData from "./section-components/single-data";

interface IChartsSection {
    commits_by_day: CommitByDay[];
    code_quality: CodeQualityMetrics;
}

const ChartsSection = ({ commits_by_day = [], code_quality }: IChartsSection) => {

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
                        <div className="flex items-end h-full gap-1">
                            {commits_by_day.map((item) => {
                                const max = Math.max(1, ...commits_by_day.map((c) => c.count));
                                const height = Math.max(4, (item.count / max) * 100);
                                const date = moment(item.date);

                                return (
                                    <div
                                        key={item.date}
                                        className="flex-1 flex flex-col items-center group relative"
                                    >
                                        <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap pointer-events-none z-10">
                                            {item.count} commits
                                            <br />
                                            {date.format('YYYY/MM/DD')}
                                        </div>
                                        <div
                                            className="w-full bg-gradient-to-t from-blue-400 to-blue-500 rounded-t transition-all duration-300 hover:from-blue-500 hover:to-blue-600"
                                            style={{
                                                height: `${height}%`,
                                                minHeight: '4px',
                                            }}
                                        />
                                        <span className="text-[10px] text-gray-400 mt-1 transform rotate-45 origin-bottom-left">
                                            {date.format('MM/DD')}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>

        {/* Code Quality */}
        <Card className="border-0 shadow-md">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-gray-700">
                    📊 Code Quality Metrics
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4">
                    <SingleData title='Approval Rate' value={`${code_quality.approval_rate}%`} color='green' />
                    <SingleData title='Changes Requested' value={`${code_quality.changes_requested_rate}%`} color='yellow' />
                    <SingleData title='Merge Rate' value={`${code_quality.merge_rate}%`} color='blue' />
                    <SingleData title='Avg Reviews/PR' value={`${code_quality.avg_reviews_per_pr}`} color='purple' />
                </div>
            </CardContent>
        </Card>
    </CardSectionWrapper>
}

export default ChartsSection