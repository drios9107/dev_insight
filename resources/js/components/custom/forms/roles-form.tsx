import { useForm } from '@inertiajs/react';
import { useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import ShadInput from '../inputs/shad-input';
import ShadTextarea from '../inputs/shad-textarea';
import { SimpleModal } from '../simple-modal';

const defaultData = {
    name: '',
    description: '',
};

const CustomForm = ({ item, onClose }: { item?: any; onClose: () => void }) => {
    const { data, setData, post, put, processing, errors } =
        useForm(defaultData);

    useEffect(() => {
        if (item) {
            setData({
                name: item?.name,
                description: item?.description,
            });
        }
    }, [item, setData]);

    const onSubmit = useCallback(() => {
        const url = item ? `/role/${item.id}` : '/role';
        const fn = item ? put : post;

        fn(url, {
            onSuccess: () => {
                toast.success(
                    item
                        ? 'Role updated successfully! 🎉'
                        : 'Role created successfully! 🎉',
                    { duration: 3000 },
                );
                onClose();
            },
            onError: (errors) => {
                const firstError = Object.values(errors)[0];
                toast.error(firstError ?? 'Unable to save', {
                    className: 'text-red-500',
                });
            },
        });
    }, [item, onClose, post, put]);

    return (
        <SimpleModal
            onClick={onSubmit}
            onClose={onClose}
            title="Create Role"
            description="Create a new role"
            isLoading={processing}
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
