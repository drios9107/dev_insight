import { SimpleModal } from "../simple-modal"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "@inertiajs/react"
import ShadInput from "../inputs/shad-input"
import ShadTextarea from "../inputs/shad-textarea"
import { toast } from "sonner"

const defaultData = {
    name: '',
    description: '',
}

const CustomForm = ({ item, onClose }: { item?: any, onClose: () => void }) => {
    const { data, setData, post, put, processing, errors, reset } = useForm(defaultData)

    useEffect(() => {
        if (item) {
            setData({
                name: item?.name,
                description: item?.description,
            })
        }
    }, [item, setData])

    const onSubmit = useCallback(() => {
        const url = item ? `/role/${item.id}` : '/role'
        const fn = item ? put : post;

        fn(url, {
            onSuccess: (res) => {
                toast.success(
                    item ? 'Role updated successfully! 🎉' : 'Role created successfully! 🎉',
                    { duration: 3000 }
                )
                onClose()
            },
            onError: () => {
                toast.error(`Role creation failed: ${errors.toString()}`, { className: 'text-red-500' })
            },
        })
    }, [item, data, setData])

    return <SimpleModal onClick={onSubmit} onClose={onClose} title="Create Role" description="Create a new role" isLoading={processing}><>
        <ShadInput required label="Name" name="name" value={data.name} onChange={(e) => setData('name', e.target.value)} errors={errors} />
        <ShadTextarea label="Description" name="description" value={data.description} onChange={(e) => setData('description', e.target.value)} errors={errors} />
    </></SimpleModal>
}

export default CustomForm