import { Button } from "@/components/ui/button"
import { SimpleModal } from "../simple-modal"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "@inertiajs/react"
import ShadInput from "../inputs/shad-input"
import ShadSwitch from "../inputs/shad-switch"
import ShadSelect from "../inputs/shad-select"
import ShadTextarea from "../inputs/shad-textarea"
import { toast } from "sonner"

const defaultData = {
    name: '',
    description: '',
    owner_id: '',
    avatar_url: '',
    is_active: true,
}

const CustomForm = ({ item, onClose }: { item?: any, onClose: () => void }) => {
    const { data, setData, post, put, processing, errors } = useForm(defaultData)
    const [users, setUsers] = useState([])

    useEffect(() => {
        fetch('http://localhost:8000/all-users')
            .then(async res => {
                if (res.ok) {
                    const data = await res.json()
                    setUsers(data.data.map((i: any) => ({ value: i.id, label: i.name })))
                }
            })
            .catch(err => console.log('***users error', err))
    }, [])

    useEffect(() => {
        if (item) {
            setData('name', item?.name)
            setData('description', item?.description)
            setData('owner_id', item?.owner_id)
            setData('avatar_url', item?.avatar_url)
            setData('is_active', item?.is_active)
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
                console.log('***errors', errors)
                toast.error('Team creation failed', { className: 'text-red-500' })
            },
        })
    }, [item, data, setData])

    return <SimpleModal onClose={onClose} title="Create Team" description="Create a new team" isLoading={processing}><>
        <ShadInput required label="Name" name="name" value={data.name} onChange={(e) => setData('name', e.target.value)} errors={errors} />
        <ShadSelect required label="Owner ID" name="owner_id" value={data.owner_id} onChange={(e: string) => setData('owner_id', e)} list={users} errors={errors} />
        <ShadInput label="Avatar URL" name="avatar_url" value={data.avatar_url} onChange={(e) => setData('avatar_url', e.target.value)} />
        <ShadSwitch label="Is Active" name="is_active" value={data.is_active} onChange={(e) => setData('is_active', e)} />
        <ShadTextarea label="Description" name="description" value={data.description} onChange={(e) => setData('description', e.target.value)} errors={errors} />
        <Button type="submit" onClick={onSubmit}>Save</Button>
    </></SimpleModal>
}

export default CustomForm