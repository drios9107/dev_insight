// resources/js/components/custom/github-user/import-github-user-modal.tsx

import { useCallback, useState } from 'react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { SimpleModal } from '@/components/custom/simple-modal';
import ShadInput from '@/components/custom/inputs/shad-input';
import githubUser from '@/routes/github-user';

interface ImportGithubUserModalProps {
    onClose: () => void;
    onSuccess?: () => void;
}

export function ImportGithubUserModal({ onClose, onSuccess }: ImportGithubUserModalProps) {
    const [username, setUsername] = useState('');
    const [isImporting, setIsImporting] = useState(false);

    const handleImport = useCallback(() => {
        if (!username.trim()) return;

        setIsImporting(true);

        router.post(
            githubUser.import().url,
            { username },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setUsername('');
                    toast.success('User imported successfully');
                    onSuccess?.();
                    onClose();
                },
                onError: (errors) => {
                    toast.error(errors.username || 'Import failed');
                },
                onFinish: () => setIsImporting(false),
            }
        );
    }, [username]);

    return (
        <SimpleModal
            title="Import GitHub User"
            description="Enter a GitHub username to import"
            onClose={onClose}
            onClick={handleImport}
            isLoading={isImporting}
            confirmText="Import"
            height={null}
        >
            <ShadInput
                required
                label="GitHub Username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                disabled={isImporting}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') handleImport();
                }}
            />
        </SimpleModal>
    );
}

export default ImportGithubUserModal;