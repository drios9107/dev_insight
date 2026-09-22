import { Link, usePage } from '@inertiajs/react';
import {
    Bug,
    CheckSquare,
    DiamondPercent,
    FolderGit2,
    GitCommit,
    Group,
    History,
    LayoutDashboard,
    ListCheck,
    ListStart,
    Shield,
    Users2,
    Workflow,
} from 'lucide-react';
import { useMemo } from 'react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import activityLog from '@/routes/activity-log';
import commit from '@/routes/commit';
import githubIssue from '@/routes/github-issue';
import githubRepository from '@/routes/github-repository';
import githubUser from '@/routes/github-user';
import metric from '@/routes/metric';
import project from '@/routes/project';
import pullRequest from '@/routes/pull-request';
import pullRequestReview from '@/routes/pull-request-review';
import role from '@/routes/role';
import sprint from '@/routes/sprint';
import task from '@/routes/task';
import team from '@/routes/team';
import user from '@/routes/user';
import type { NavItem } from '@/types';

const adminNavItems: NavItem[] = [
    {
        title: 'Logs',
        href: activityLog.index(),
        icon: History,
    },
    {
        title: 'Roles',
        href: role.index(),
        icon: Shield,
    },
    {
        title: 'Users',
        href: user.index(),
        icon: Users2,
    },
];

const mainNavItems: NavItem[] = [
    {
        title: 'Metrics',
        href: metric.index(),
        icon: LayoutDashboard,
    },
    {
        title: 'Projects',
        href: project.index(),
        icon: Workflow,
    },
    {
        title: 'Teams',
        href: team.index(),
        icon: Group,
    },
    {
        title: 'Sprints',
        href: sprint.index(),
        icon: ListStart,
    },
    {
        title: 'Tasks',
        href: task.index(),
        icon: ListCheck,
    },
];

const githubNavItems: NavItem[] = [
    {
        title: 'Repositories',
        href: githubRepository.index(),
        icon: FolderGit2,
    },
    {
        title: 'Users',
        href: githubUser.index(),
        icon: Users2,
    },
    {
        title: 'Issues',
        href: githubIssue.index(),
        icon: Bug,
    },
    {
        title: 'PRs',
        href: pullRequest.index(),
        icon: DiamondPercent,
    },
    {
        title: 'Reviews',
        href: pullRequestReview.index(),
        icon: CheckSquare,
    },
    {
        title: 'Commit',
        href: commit.index(),
        icon: GitCommit,
    },
];

export function AppSidebar() {
    const { props } = usePage();
    const isAdmin = useMemo(
        () => props.auth.user?.role?.name === 'Admin',
        [props.auth.user?.role?.name],
    );

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={metric.index().url} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                <NavMain items={githubNavItems} title="Github" />
                {isAdmin && <NavMain items={adminNavItems} title="Admin" />}
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
