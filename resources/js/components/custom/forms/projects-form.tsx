import { Button } from "@/components/ui/button"
import { SimpleModal } from "../simple-modal"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useForm } from "@inertiajs/react"
import ShadInput from "../inputs/shad-input"
import ShadSelect from "../inputs/shad-select"
import ShadTextarea from "../inputs/shad-textarea"
import { toast } from "sonner"
import user from "@/routes/user"
import { useFetch } from "@/hooks/use-fetch"
import team from "@/routes/team"
import githubsRepository from "@/routes/githubs-repository"
import { TProjectStatus } from "@/types/models/project"
import { ShadDate } from "../inputs/shad-date"
import { ShadColor } from "../inputs/shad-color"
import { ProjectStatusEnum } from "@/enums/project"

const defaultData = {
    name: '',
    description: '',
    team_id: '',
    owner_id: '',
    github_repository_id: '',
    status: 'planning',
    color: '#fafafa',
    start_date: new Date().toISOString().slice(0, 10),
    end_date: new Date().toISOString().slice(0, 10),
}

const CustomForm = ({ item, onClose }: { item?: any, onClose: () => void }) => {
    const { data, setData, post, put, processing, errors, reset } = useForm(defaultData)
    const { get } = useFetch()

    const [users, setUsers] = useState([])
    const [usersLoading, setUsersLoading] = useState(false)

    const [teams, setTeams] = useState([])
    const [teamsLoading, setTeamsLoading] = useState(false)

    const [githubRepositories, setGithubRepositories] = useState([])
    const [githubRepositoriesLoading, setGithubRepositoriesLoading] = useState(false)

    const fetchSelectorsData = useCallback(async () => {
        setUsersLoading(true)
        setTeamsLoading(true);
        setGithubRepositoriesLoading(true);

        await Promise.all([
            get(user.all().url, setUsers),
            get(team.all().url, setTeams),
            get(githubsRepository.all().url, setGithubRepositories)
        ])
            .finally(() => {
                setUsersLoading(false);
                setTeamsLoading(false);
                setGithubRepositoriesLoading(false);
            });
    }, [])

    useEffect(() => {
        fetchSelectorsData()
    }, [])

    useEffect(() => {
        if (item) {
            console.log('***item', item)
            setData({
                name: item?.name,
                description: item?.description,
                team_id: item?.team?.id?.toString(),
                owner_id: item?.owner?.id?.toString(),
                github_repository_id: item?.github_repository?.id?.toString(),
                status: ProjectStatusEnum[item.status as TProjectStatus],
                color: item?.color,
                start_date: item?.start_date,
                end_date: item?.end_date,
            })
        }
    }, [item, setData])

    const statuses = useMemo(() => {
        return Object.keys(ProjectStatusEnum)
            .map((i: string) => ({
                value: i,
                label: ProjectStatusEnum[i as TProjectStatus]
            }))
    }, [])

    const onSubmit = useCallback(() => {
        const url = item ? `/project/${item.id}` : '/project'
        const fn = item ? put : post;
        console.log('***h', data)
        fn(url, {
            onBefore: () => {
                // setData('start_date', 1)
                // setData('end_date', 1)
            },
            onSuccess: (res) => {
                toast.success(
                    item ? 'Project updated successfully! 🎉' : 'Project created successfully! 🎉',
                    { duration: 3000 }
                )
                onClose()
            },
            onError: () => {
                toast.error(`Project creation failed: ${errors.toString()}`, { className: 'text-red-500' })
            },
        })
    }, [item, data, setData])

    return <SimpleModal onClick={onSubmit} onClose={onClose} title="Create Project" description="Create a new project" isLoading={processing || usersLoading || teamsLoading || githubRepositoriesLoading}><>
        <ShadInput required label="Name" name="name" value={data.name} onChange={(e) => setData('name', e.target.value)} errors={errors} />
        <ShadSelect required label="Owner" name="owner_id" value={data.owner_id} onChange={(e: string) => setData('owner_id', e)} list={users} errors={errors} />
        <ShadSelect required label="Team" name="team_id" value={data.team_id} onChange={(e: string) => setData('team_id', e)} list={teams} errors={errors} />
        <ShadSelect required label="Github Repository" name="github_repository_id" value={data.github_repository_id} onChange={(e: string) => setData('github_repository_id', e)} list={githubRepositories} errors={errors} />

        <div className="flex justify-between gap-3">
            <ShadSelect required label="Status" name="status" value={data.status} onChange={(e: string) => setData('status', e)} list={statuses} errors={errors} />
            <ShadColor label="Color" name="color" value={data.color} onChange={(e) => setData("color", e.target.value)} errors={errors} />
        </div>

        <div className="flex justify-between gap-3">
            <ShadDate required label="Start Date" name="start_date" value={data.start_date} onChange={(e) => setData('start_date', e.target.value)} errors={errors} />
            <ShadDate required label="End Date" name="end_date" value={data.end_date} onChange={(e) => setData('end_date', e.target.value)} errors={errors} />
        </div>

        <ShadTextarea label="Description" name="description" value={data.description} onChange={(e) => setData('description', e.target.value)} errors={errors} />
    </></SimpleModal>
}

export default CustomForm