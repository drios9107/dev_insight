// resources/js/components/custom/metrics/sync-button.tsx

import { router } from '@inertiajs/react';
import { RefreshCw } from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface SyncButtonProps {
    repositoryId: string | number | null;
}

export function SyncButton({ repositoryId }: SyncButtonProps) {
    const [isSyncing, setIsSyncing] = useState(false);

    const handleSync = useCallback(() => {
        if (!repositoryId || repositoryId === 'all') {
            toast.error('Please select a repository first');

            return;
        }

        setIsSyncing(true);

        router.post(
            `/github/sync/${repositoryId}`,
            {},
            {
                onSuccess: () => {
                    toast.success('Repository synced successfully');
                    router.reload();
                },
                onError: (error) => {
                    toast.error(`Sync failed: ${error?.message}`);
                },
                onFinish: () => setIsSyncing(false),
            },
        );
    }, [repositoryId]);

    return (
        <Button
            onClick={handleSync}
            disabled={isSyncing || !repositoryId || repositoryId === 'all'}
            variant="outline"
            size="sm"
            className="h-9 gap-2"
        >
            <RefreshCw
                className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`}
            />
            {isSyncing ? 'Syncing...' : 'Sync'}
        </Button>
    );
}
