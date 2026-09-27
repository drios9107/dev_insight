import { useForm } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useFetch } from '@/hooks/use-fetch';
import githubUser from '@/routes/github-user';
import user from '@/routes/user';
import ShadInput from '../inputs/shad-input';
import ShadMultiSelect from '../inputs/shad-multiselect';
import ShadSelect from '../inputs/shad-select';
import ShadSwitch from '../inputs/shad-switch';
import ShadTextarea from '../inputs/shad-textarea';
import { SimpleModal } from '../simple-modal';

const defaultData = {
    name: '',
    description: '',
    owner_id: '',
    is_active: true,
    github_user_ids: [] as number[],
};

const CustomForm = ({ item, onClose }: { item?: any; onClose: () => void }) => {
    const { data, setData, post, put, processing, errors } =
        useForm(defaultData);
    const [users, setUsers] = useState([]);
    const [githubUsers, setGithubUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(false);
    const [githubUsersLoading, setGithubUsersLoading] = useState(false);
    const { get } = useFetch();

    useEffect(() => {
        setUsersLoading(true);
        get(user.all().url, setUsers).finally(() => setUsersLoading(false));
    }, [get]);

    useEffect(() => {
        setGithubUsersLoading(true);
        get(githubUser.all().url, setGithubUsers, 'display_name').finally(() =>
            setGithubUsersLoading(false),
        );
    }, [get]);

    useEffect(() => {
        if (item) {
            setData({
                name: item?.name ?? '',
                description: item?.description ?? '',
                owner_id: item?.owner?.id?.toString() ?? '',
                is_active: item?.is_active ?? true,
                github_user_ids:
                    item?.github_users?.map((u: any) => u.id) ?? [],
            });
        }
    }, [item, setData]);

    const onSubmit = useCallback(() => {
        const url = item ? `/team/${item.id}` : '/team';
        const fn = item ? put : post;

        fn(url, {
            onSuccess: () => {
                toast.success(
                    item
                        ? 'Team updated successfully! 🎉'
                        : 'Team created successfully! 🎉',
                    { duration: 3000 },
                );
                onClose();
            },
            onError: () => {
                toast.error(`Team creation failed: ${errors.toString()}`, {
                    className: 'text-red-500',
                });
            },
        });
    }, [item, put, post, errors, onClose]);

    return (
        <SimpleModal
            onClick={onSubmit}
            onClose={onClose}
            title={item ? 'Edit Team' : 'Create Team'}
            description={item ? 'Update team details' : 'Create a new team'}
            isLoading={processing || usersLoading || githubUsersLoading}
        >
            <>
                <ShadInput
                    required
                    label="Name"
                    name="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    errors={errors}
                />
                <ShadSelect
                    required
                    label="Owner"
                    name="owner_id"
                    value={data.owner_id}
                    onChange={(e: string) => setData('owner_id', e)}
                    list={users}
                    errors={errors}
                />
                <ShadMultiSelect
                    label="Developers"
                    name="github_user_ids"
                    value={data.github_user_ids}
                    onChange={(value) =>
                        setData('github_user_ids', value as number[])
                    }
                    list={githubUsers}
                    errors={errors}
                    placeholder="Select developers..."
                />
                <ShadSwitch
                    label="Is Active"
                    name="is_active"
                    value={data.is_active}
                    onChange={(e) => setData('is_active', e)}
                />
                <ShadTextarea
                    label="Description"
                    name="description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    errors={errors}
                />
            </>
        </SimpleModal>
    );
};

export default CustomForm;
