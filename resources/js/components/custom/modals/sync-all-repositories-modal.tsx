import { router } from '@inertiajs/react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import ShadInput from '@/components/custom/inputs/shad-input';
import { SimpleModal } from '@/components/custom/simple-modal';
import githubRepository from '@/routes/github-repository';

interface SyncAllRepositoriesModalProps {
    onClose: () => void;
    onSuccess?: () => void;
    defaultUsername?: string;
}

export function SyncAllRepositoriesModal({
    onClose,
    onSuccess,
    defaultUsername = '',
}: SyncAllRepositoriesModalProps) {
    const [username, setUsername] = useState(defaultUsername);
    const [isSyncing, setIsSyncing] = useState(false);

    const handleSyncAll = useCallback(() => {
        if (!username.trim()) {
            toast.error('Please enter a GitHub username');

            return;
        }

        setIsSyncing(true);

        router.post(
            githubRepository.syncAll().url,
            { ownerKey: username },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Repositories synced successfully');
                    onSuccess?.();
                    onClose();
                },
                onError: (errors) => {
                    toast.error(errors.ownerKey || 'Sync failed');
                },
                onFinish: () => setIsSyncing(false),
            },
        );
    }, [username, onSuccess, onClose]);

    return (
        <SimpleModal
            title="Sync GitHub Repositories"
            description="Enter a GitHub username to sync all their repositories"
            onClose={onClose}
            onClick={handleSyncAll}
            isLoading={isSyncing}
            confirmText="Sync"
            height={null}
        >
            <div className="space-y-4 py-4">
                <div className="space-y-2">
                    <ShadInput
                        required
                        label="Github username"
                        name="github-username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={isSyncing}
                        placeholder="Username"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSyncAll();
                            }
                        }}
                    />
                    <p className="text-xs text-gray-500">
                        This will fetch and sync all public and private
                        repositories of the user
                    </p>
                </div>
            </div>
        </SimpleModal>
    );
}

export default SyncAllRepositoriesModal;
