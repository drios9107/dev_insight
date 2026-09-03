import { SimpleModal } from "../simple-modal"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useForm } from "@inertiajs/react"
import ShadInput from "../inputs/shad-input"
import ShadSelect from "../inputs/shad-select"
import ShadTextarea from "../inputs/shad-textarea"
import { toast } from "sonner"
import { useFetch } from "@/hooks/use-fetch"
import { TSprintStatus } from "@/types/models/sprint"
import { ShadDate } from "../inputs/shad-date"
import { ShadColor } from "../inputs/shad-color"
import { SprintStatusEnum } from "@/enums/sprint"
import project from "@/routes/project"

const defaultData = {
    name: '',
    goal: '',
    project_id: '',
    status: 'planning',
    velocity: 1,
    actual_velocity: 1,
    start_date: new Date().toISOString().slice(0, 10),
    end_date: new Date().toISOString().slice(0, 10),
}

const CustomForm = ({ item, onClose }: { item?: any, onClose: () => void }) => {
    const { data, setData, post, put, processing, errors, reset } = useForm(defaultData)
    const { get } = useFetch()

    const [projects, setProjects] = useState([])
    const [projectsLoading, setProjectsLoading] = useState(false)

    const fetchSelectorsData = useCallback(async () => {
        setProjectsLoading(true)

        await Promise.all([
            get(project.all().url, setProjects),
        ])
            .finally(() => {
                setProjectsLoading(false);
            });
    }, [])

    useEffect(() => {
        fetchSelectorsData()
    }, [])

    useEffect(() => {
        if (item) {
            setData({
                name: item?.name,
                goal: item?.goal,
                project_id: item?.project?.id?.toString(),
                status: item?.status,
                velocity: item?.velocity ?? 0,
                actual_velocity: item?.actual_velocity ?? 0,
                start_date: item?.start_date,
                end_date: item?.end_date,
            })
        }
    }, [item, setData])

    const statuses = useMemo(() => {
        return Object.keys(SprintStatusEnum)
            .map((i: string) => ({
                value: i,
                label: SprintStatusEnum[i as TSprintStatus]
            }))
    }, [])

    const parseNumber = useCallback((v: string) => {
        return v ? parseInt(v) : 0
    }, [])

    const onSubmit = useCallback(() => {
        const url = item ? `/sprint/${item.id}` : '/sprint'
        const fn = item ? put : post;
        console.log('***h', data)
        fn(url, {
            onBefore: () => {
                // setData('start_date', 1)
                // setData('end_date', 1)
            },
            onSuccess: (res) => {
                toast.success(
                    item ? 'Sprint updated successfully! 🎉' : 'Sprint created successfully! 🎉',
                    { duration: 3000 }
                )
                onClose()
            },
            onError: () => {
                toast.error(`Sprint creation failed: ${errors.toString()}`, { className: 'text-red-500' })
            },
        })
    }, [item, data, setData])

    return <SimpleModal onClick={onSubmit} onClose={onClose} title="Create Sprint" description="Create a new sprint" isLoading={processing || projectsLoading}><>
        <ShadInput required label="Name" name="name" value={data.name} onChange={(e) => setData('name', e.target.value)} errors={errors} />
        <ShadSelect required label="Project" name="project_id" value={data.project_id} onChange={(e: string) => setData('project_id', e)} list={projects} errors={errors} />
        <ShadSelect required label="Status" name="status" value={data.status} onChange={(e: string) => setData('status', e)} list={statuses} errors={errors} />

        <div className="flex justify-between gap-3">
            <ShadInput required type="number" label="Velocity" name="velocity" value={data.velocity} onChange={(e) => setData('velocity', parseNumber(e.target.value))} errors={errors} />
            <ShadInput required type="number" label="Actual Velocity" name="actual_velocity" value={data.actual_velocity} onChange={(e) => setData('actual_velocity', parseNumber(e.target.value))} errors={errors} />
        </div>

        <div className="flex justify-between gap-3">
            <ShadDate required label="Start Date" name="start_date" value={data.start_date} onChange={(e) => setData('start_date', e.target.value)} errors={errors} />
            <ShadDate required label="End Date" name="end_date" value={data.end_date} onChange={(e) => setData('end_date', e.target.value)} errors={errors} />
        </div>

        <ShadTextarea label="Description" name="goal" value={data.goal} onChange={(e) => setData('goal', e.target.value)} errors={errors} />
    </></SimpleModal>
}

export default CustomForm