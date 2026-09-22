import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { CodeQualityMetrics, PrCycleTime } from '@/types/metric';
import CardSectionWrapper from './section-components/card-section-wrapper';
import PrCycle from './section-components/pr-cycle';
import SingleData from './section-components/single-data';

interface ICodeQualitySection {
    code_quality: CodeQualityMetrics;
    pr_cycle_time: PrCycleTime;
}

const CodeQualitySection = ({
    code_quality,
    pr_cycle_time,
}: ICodeQualitySection) => {
    return (
        <CardSectionWrapper className="gap-6 lg:grid-cols-2">
            {/* ========== CODE QUALITY ========== */}
            <Card className="border-0 shadow-md">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold text-gray-700">
                        📊 Code Quality Metrics
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                        <SingleData
                            title="Approval Rate"
                            value={`${code_quality.approval_rate}%`}
                            color="green"
                        />
                        <SingleData
                            title="Changes Requested"
                            value={`${code_quality.changes_requested_rate}%`}
                            color="yellow"
                        />
                        <SingleData
                            title="Merge Rate"
                            value={`${code_quality.merge_rate}%`}
                            color="blue"
                        />
                        <SingleData
                            title="Avg Reviews/PR"
                            value={`${code_quality.avg_reviews_per_pr}`}
                            color="purple"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* ========== PR CYCLE TIME ========== */}
            <PrCycle pr_cycle_time={pr_cycle_time} />
        </CardSectionWrapper>
    );
};

export default CodeQualitySection;
