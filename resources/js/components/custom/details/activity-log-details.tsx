import { Calendar, Globe, Monitor, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { ActivityLogTypeEnum } from '@/enums/activity-log';
import { useFetch } from '@/hooks/use-fetch';
import { getActivityLogTypeColor } from '@/lib/utils/activity-log';
import activityLog from '@/routes/activity-log';
import type { IActivityLogShow } from '@/types/models/activity-log';
import DetailItem from '../detail-item';
import { Loader } from '../loader';
import ShadDrawer from '../shad-drawer';
import ActivityChanges from '../activity-changes';

interface ActivityLogDetailsProps {
    itemId: number;
    onClose: () => void;
}

export function ActivityLogDetails({
    itemId,
    onClose,
}: ActivityLogDetailsProps) {
    const [itemToView, setItemToView] = useState<IActivityLogShow | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { getOne } = useFetch();

    useEffect(() => {
        setIsLoading(true);
        getOne(activityLog.show(itemId).url)
            .then((res) => setItemToView(res?.data))
            .finally(() => setIsLoading(false));
    }, [itemId, getOne]);

    console.log('***itemtoview', itemToView);

    return (
        <ShadDrawer
            title="Activity Details"
            isOpen
            setIsOpen={(open) => !open && onClose()}
        >
            {isLoading || !itemToView ? (
                <Loader />
            ) : (
                <div className="space-y-6">
                    {/* HEADER */}
                    <div>
                        <div className="mb-2 flex items-center gap-2">
                            <Badge
                                variant={getActivityLogTypeColor(
                                    itemToView.type,
                                )}
                            >
                                {ActivityLogTypeEnum[itemToView.type]}
                            </Badge>
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            {itemToView.description}
                        </h2>
                    </div>

                    {/* METADATA */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <DetailItem
                            icon={User}
                            label="User"
                            value={itemToView.user?.name}
                        />
                        <DetailItem
                            icon={Calendar}
                            label="Date"
                            value={itemToView.created_at}
                        />
                        <DetailItem
                            icon={Globe}
                            label="IP Address"
                            value={itemToView.ip_address}
                        />
                        <DetailItem
                            icon={Monitor}
                            label="User Agent"
                            value={itemToView.user_agent}
                        />
                    </div>

                    {/* CHANGES */}
                    <ActivityChanges item={itemToView} />

                    {/* DATES */}
                    <div className="border-t pt-4 text-xs text-gray-400">
                        <span className="font-medium">Created:</span>{' '}
                        {itemToView.created_at}
                    </div>
                </div>
            )}
        </ShadDrawer>
    );
}
