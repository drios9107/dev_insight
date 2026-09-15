import { SimpleModal } from "../simple-modal"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useForm } from "@inertiajs/react"
import ShadInput from "../inputs/shad-input"
import ShadSelect from "../inputs/shad-select"
import ShadTextarea from "../inputs/shad-textarea"
import { toast } from "sonner"
import user from "@/routes/user"
import { useFetch } from "@/hooks/use-fetch"
import project from "@/routes/project"
import { ShadDate } from "../inputs/shad-date"
import sprint from "@/routes/sprint"
import { TaskPriorityEnum, TaskStatusEnum, TTaskPriority, TTaskStatus } from "@/enums/task"

const defaultData = {
    title: '',
    description: '',
    project_id: '',
    assignee_id: '',
    sprint_id: '',
    reporter_id: '',
    status: 'planning',
    priority: 'low',
    due_date: new Date().toISOString().slice(0, 10),
    completed_at: null,
    story_points: 0,
    hours_estimate: 0,
    hours_spent: 0,
    order: 0
}

const CustomForm = ({ item, onClose }: { item?: any, onClose: () => void }) => {
    const { data, setData, post, put, processing, errors, reset } = useForm(defaultData)
    const { get } = useFetch()

    const [users, setUsers] = useState([])
    const [usersLoading, setUsersLoading] = useState(false)

    const [projects, setProjects] = useState([])
    const [projectsLoading, setProjectsLoading] = useState(false)

    const [sprints, setSprints] = useState([])
    const [sprintsLoading, setSprintsLoading] = useState(false)

    const fetchSelectorsData = useCallback(async () => {
        setUsersLoading(true)
        setProjectsLoading(true);
        setSprintsLoading(true);

        await Promise.all([
            get(user.all().url, setUsers),
            get(project.all().url, setProjects),
            get(sprint.all().url, setSprints)
        ])
            .finally(() => {
                setUsersLoading(false);
                setProjectsLoading(false);
                setSprintsLoading(false);
            });
    }, [setUsersLoading,
        setProjectsLoading,
        setSprintsLoading])

    useEffect(() => {
        fetchSelectorsData()
    }, [])

    useEffect(() => {
        if (item) {
            setData({
                title: item?.title,
                description: item?.description,
                project_id: item?.project?.id?.toString(),
                assignee_id: item?.assignee?.id?.toString(),
                sprint_id: item?.sprint?.id?.toString(),
                reporter_id: item?.reporter?.id?.toString(),
                status: item.status,
                priority: item.priority,
                due_date: item?.due_date,
                completed_at: item?.completed_at,
                story_points: item?.story_points,
                hours_estimate: item?.hours_estimate,
                hours_spent: item?.hours_spent,
                order: item?.order,
            })
        }
    }, [item, setData])

    const statuses = useMemo(() => {
        return Object.keys(TaskStatusEnum)
            .map((i: string) => ({
                value: i,
                label: TaskStatusEnum[i as TTaskStatus]
            }))
    }, [])

    const priorities = useMemo(() => {
        return Object.keys(TaskPriorityEnum)
            .map((i: string) => ({
                value: i,
                label: TaskPriorityEnum[i as TTaskPriority]
            }))
    }, [])

    const parseNumber = useCallback((v: string) => {
        return v ? parseInt(v) : 0
    }, [])

    const onSubmit = useCallback(() => {
        const url = item ? `/task/${item.id}` : '/task'
        const fn = item ? put : post;
        console.log('***h', data)
        fn(url, {
            onBefore: () => {
                // setData('start_date', 1)
                // setData('end_date', 1)
            },
            onSuccess: (res) => {
                toast.success(
                    item ? 'Task updated successfully! 🎉' : 'Task created successfully! 🎉',
                    { duration: 3000 }
                )
                onClose()
            },
            onError: () => {
                toast.error(`Task creation failed: ${errors.toString()}`, { className: 'text-red-500' })
            },
        })
    }, [item, data, setData])

    return <SimpleModal onClick={onSubmit} onClose={onClose} title="Create Task" description="Create a new task" isLoading={processing || usersLoading || projectsLoading || sprintsLoading}><>

        <ShadInput required label="Title" name="title" value={data.title} onChange={(e) => setData('title', e.target.value)} errors={errors} />
        <ShadSelect required label="Assignee" name="assignee_id" value={data.assignee_id} onChange={(e: string) => setData('assignee_id', e)} list={users} errors={errors} />
        <ShadSelect required label="Reporter" name="reporter_id" value={data.reporter_id} onChange={(e: string) => setData('reporter_id', e)} list={users} errors={errors} />
        <ShadSelect required label="Project" name="project_id" value={data.project_id} onChange={(e: string) => setData('project_id', e)} list={projects} errors={errors} />
        <ShadSelect required label="Sprint" name="sprint_id" value={data.sprint_id} onChange={(e: string) => setData('sprint_id', e)} list={sprints} errors={errors} />

        <div className="flex justify-between gap-3">
            <ShadSelect required label="Status" name="status" value={data.status} onChange={(e: string) => setData('status', e)} list={statuses} errors={errors} />
            <ShadSelect required label="Priority" name="priority" value={data.priority} onChange={(e: string) => setData('priority', e)} list={priorities} errors={errors} />
        </div>

        <div className="flex justify-between gap-3">
            <ShadInput required label="Story Points" name="story_points" value={data.story_points} onChange={(e) => setData('story_points', parseNumber(e.target.value))} errors={errors} />
            <ShadInput required label="Order" name="order" value={data.order} onChange={(e) => setData('order', parseNumber(e.target.value))} errors={errors} />
        </div>

        <div className="flex justify-between gap-3">
            <ShadInput required label="Hours Estimate" name="hours_estimate" value={data.hours_estimate} onChange={(e) => setData('hours_estimate', parseNumber(e.target.value))} errors={errors} />
            <ShadInput required label="Hours Spent" name="hours_spent" value={data.hours_spent} onChange={(e) => setData('hours_spent', parseNumber(e.target.value))} errors={errors} />
        </div>

        <div className="flex justify-between gap-3">
            <ShadDate required label="Due Date" name="due_date" value={data.due_date} onChange={(e) => setData('due_date', e.target.value)} errors={errors} />
            <div className="w-full"></div>
        </div>

        <ShadTextarea label="Description" name="description" value={data.description} onChange={(e) => setData('description', e.target.value)} errors={errors} />
    </></SimpleModal>
}

export default CustomForm