import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Bug, CheckSquare, Cloud, DiamondPercent, FolderGit2, GitCommit, Group, History, LayoutDashboard, LayoutGrid, ListCheck, ListStart, Notebook, ReceiptPoundSterling, Shield, Users2, Workflow } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
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
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';
import user from '@/routes/user';
import team from '@/routes/team';
import comment from '@/routes/comment';
import commit from '@/routes/commit';
import githubIssue from '@/routes/github-issue';
import githubRepository from '@/routes/github-repository';
import metric from '@/routes/metric';
import notification from '@/routes/notification';
import project from '@/routes/project';
import pullRequest from '@/routes/pull-request';
import pullRequestReview from '@/routes/pull-request-review';
import sprint from '@/routes/sprint';
import task from '@/routes/task';
import role from '@/routes/role';
import activityLog from '@/routes/activity-log';
import { useMemo } from 'react';

const adminNavItems: NavItem[] = [
    {
        title: 'Logs',
        href: activityLog.index(),
        icon: History,
    }, {
        title: 'Roles',
        href: role.index(),
        icon: Shield,
    }, {
        title: 'Users',
        href: user.index(),
        icon: Users2,
    }
]

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    }, {
        title: 'Comment',
        href: comment.index(),
        icon: Notebook,
    }, {
        title: 'Commit',
        href: commit.index(),
        icon: GitCommit,
    }, {
        title: 'Issues',
        href: githubIssue.index(),
        icon: Bug,
    }, {
        title: 'Repositories',
        href: githubRepository.index(),
        icon: FolderGit2,
    }, {
        title: 'Metrics',
        href: metric.index(),
        icon: LayoutDashboard,
    }, {
        title: 'Notifications',
        href: notification.index(),
        icon: Cloud,
    }, {
        title: 'Projects',
        href: project.index(),
        icon: Workflow,
    }, {
        title: 'PRs',
        href: pullRequest.index(),
        icon: DiamondPercent,
    }, {
        title: 'PR Reviewers',
        href: pullRequestReview.index(),
        icon: CheckSquare,
    }, {
        title: 'Sprints',
        href: sprint.index(),
        icon: ListStart,
    }, {
        title: 'Tasks',
        href: task.index(),
        icon: ListCheck,
    }, {
        title: 'Teams',
        href: team.index(),
        icon: Group,
    }
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { props } = usePage()
    console.log('***props', props)
    const isAdmin = useMemo(() => props.auth.user?.role?.name === 'Admin', [])

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                {isAdmin && <NavMain items={adminNavItems} title='Admin' />}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
