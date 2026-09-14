import { PrCycleTime } from "@/types/metric";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SingleData from "./single-data";

interface IPrCycle {
    pr_cycle_time: PrCycleTime;
}

const PrCycle = ({ pr_cycle_time }: IPrCycle) => {

    return <Card className="border-0 shadow-md">
        <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-gray-700">
                ⏱️ PR Cycle Time
            </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <SingleData title='Average' value={`${pr_cycle_time.avg}h`} color='gray' />
                <SingleData title='Min' value={`${pr_cycle_time.min}h`} color='green' />
                <SingleData title='Max' value={`${pr_cycle_time.max}h`} color='red' />
                <SingleData title='Median' value={`${pr_cycle_time.median}h`} color='blue' />
            </div>
            <div className="mt-4 flex items-center gap-4 text-xs text-gray-500 justify-center">
                <span>P25: {pr_cycle_time.p25}h</span>
                <span>P75: {pr_cycle_time.p75}h</span>
            </div>
        </CardContent>
    </Card>
}

export default PrCycle