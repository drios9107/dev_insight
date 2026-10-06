import { router } from '@inertiajs/react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import ShadInput from '@/components/custom/inputs/shad-input';
import { SimpleModal } from '@/components/custom/simple-modal';
import githubRepository from '@/routes/github-repository';

interface ImportGithubRepositoryModalProps {
    onClose: () => void;
    onSuccess?: () => void;
}

export function ImportGithubRepositoryModal({
    onClose,
    onSuccess,
}: ImportGithubRepositoryModalProps) {
    const [ownerKey, setOwnerKey] = useState('');
    const [repoName, setRepoName] = useState('');
    const [isImporting, setIsImporting] = useState(false);

    const handleImport = useCallback(() => {
        if (!ownerKey.trim() || !repoName.trim()) {
            return;
        }

        setIsImporting(true);

        router.post(
            githubRepository.import().url,
            { owner_key: ownerKey, repo_name: repoName },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setOwnerKey('');
                    setRepoName('');
                    toast.success('Repository imported successfully');
                    onSuccess?.();
                    onClose();
                },
                onError: (errors) =>
                    toast.error(
                        errors.owner_key || errors.repo_name || 'Import failed',
                    ),
                onFinish: () => setIsImporting(false),
            },
        );
    }, [ownerKey, repoName, onSuccess, onClose]);

    return (
        <SimpleModal
            title="Import GitHub Repository"
            description="Enter owner and repository name to import"
            onClose={onClose}
            onClick={handleImport}
            isLoading={isImporting}
            confirmText="Import"
            height={null}
        >
            <ShadInput
                required
                label="Owner"
                name="owner_key"
                value={ownerKey}
                onChange={(e) => setOwnerKey(e.target.value)}
                placeholder="e.g. octocat"
                disabled={isImporting}
            />
            <ShadInput
                required
                label="Repository"
                name="repo_name"
                value={repoName}
                onChange={(e) => setRepoName(e.target.value)}
                placeholder="e.g. hello-world"
                disabled={isImporting}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleImport();
                    }
                }}
            />
        </SimpleModal>
    );
}

export default ImportGithubRepositoryModal;
