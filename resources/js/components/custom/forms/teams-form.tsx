import { Button } from "@/components/ui/button"
import { SimpleModal } from "../simple-modal"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "@inertiajs/react"
import ShadInput from "../inputs/shad-input"
import ShadSwitch from "../inputs/shad-switch"
import ShadSelect from "../inputs/shad-select"
import ShadTextarea from "../inputs/shad-textarea"
import { toast } from "sonner"
import user from "@/routes/user"

const defaultData = {
    name: '',
    description: '',
    owner_id: '',
    avatar_url: '',
    is_active: true,
}

const CustomForm = ({ item, onClose }: { item?: any, onClose: () => void }) => {
    const { data, setData, post, put, processing, errors, reset } = useForm(defaultData)
    const [users, setUsers] = useState([])
    const [usersLoading, setUsersLoading] = useState(false)


    useEffect(() => {
        setUsersLoading(true)
        fetch(user.all().url)
            .then(async res => {
                if (res.ok) {
                    const data = await res.json()
                    setUsers(data.data.map((i: any) => ({ value: i.id, label: i.name })))
                }
            })
            .catch(err => console.log('***users error', err))
            .finally(() => {
                setUsersLoading(false);
            });
    }, [])

    useEffect(() => {
        if (item) {
            setData({
                name: item?.name,
                description: item?.description,
                owner_id: item?.owner?.id?.toString(),
                avatar_url: item?.avatar_url,
                is_active: item?.is_active
            })
        }
    }, [item, setData])

    const onSubmit = useCallback(() => {
        const url = item ? `/team/${item.id}` : '/team'
        const fn = item ? put : post;

        fn(url, {
            onBefore: () => {
                // setData('name', data.name?.trim())
            },
            onSuccess: (res) => {
                toast.success(
                    item ? 'Team updated successfully! 🎉' : 'Team created successfully! 🎉',
                    { duration: 3000 }
                )
                onClose()
            },
            onError: () => {
                toast.error(`Team creation failed: ${errors.toString()}`, { className: 'text-red-500' })
            },
        })
    }, [item, data, setData])

    return <SimpleModal onClick={onSubmit} onClose={onClose} title="Create Team" description="Create a new team" isLoading={processing || usersLoading}><>
        <ShadInput required label="Name" name="name" value={data.name} onChange={(e) => setData('name', e.target.value)} errors={errors} />
        <ShadSelect required label="Owner" name="owner_id" value={data.owner_id} onChange={(e: string) => setData('owner_id', e)} list={users} errors={errors} />
        <ShadInput label="Avatar URL" name="avatar_url" value={data.avatar_url} onChange={(e) => setData('avatar_url', e.target.value)} />
        <ShadSwitch label="Is Active" name="is_active" value={data.is_active} onChange={(e) => setData('is_active', e)} />
        <ShadTextarea label="Description" name="description" value={data.description} onChange={(e) => setData('description', e.target.value)} errors={errors} />
    </></SimpleModal>
}

export default CustomForm