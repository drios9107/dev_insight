// resources/js/components/custom/metrics/management-section.tsx

import { StatCard } from './section-components/stat-card';
import { ActionCard } from './section-components/action-card';
import { SectionTitle } from './section-components/section-title';
import { ListStart, Bug, ListCheck, AlertCircle, } from 'lucide-react';

interface ManagementSectionProps {
    active_projects: number;
    total_projects: number;
    active_sprints: number;
    total_sprints: number;
    sprint_completion_rate: number;
    open_issues: number;
    total_issues: number;
    avg_issue_resolution_time: number;
    tasks_in_progress: number;
    tasks_in_review: number;
    total_tasks: number;
    task_completion_rate: number;
    overdue_tasks: number;
}

export default function ManagementSection({
    active_projects,
    total_projects,
    active_sprints,
    total_sprints,
    sprint_completion_rate,
    open_issues,
    total_issues,
    avg_issue_resolution_time,
    tasks_in_progress,
    tasks_in_review,
    total_tasks,
    task_completion_rate,
    overdue_tasks,
}: ManagementSectionProps) {
    return (
        <>
            {/* ========== STAT CARDS ========== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 w-full">
                <StatCard
                    label="Active Projects"
                    value={`${active_projects} / ${total_projects}`}
                />
                <StatCard
                    label="Active Sprints"
                    value={`${active_sprints} / ${total_sprints}`}
                />
                <StatCard
                    label="Open Issues"
                    value={`${open_issues} / ${total_issues}`}
                />
                <StatCard
                    label="Tasks In Progress"
                    value={`${tasks_in_progress} / ${total_tasks}`}
                />
                <StatCard
                    label="Tasks In Review" // ✅ Nuevo
                    value={`${tasks_in_review} / ${total_tasks}`}
                />
            </div>

            {/* ========== ACTION CARDS ========== */}
            <SectionTitle title="📊 Management Overview" className="mt-6" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 w-full">
                <ActionCard
                    label="Sprint Completion"
                    value={`${sprint_completion_rate}%`}
                    icon={<ListStart className="w-5 h-5" />}
                    color="green"
                    sub="Completed sprints"
                />
                <ActionCard
                    label="Task Completion"
                    value={`${task_completion_rate}%`}
                    icon={<ListCheck className="w-5 h-5" />}
                    color="blue"
                    sub="Completed tasks"
                />
                <ActionCard
                    label="Avg Issue Resolution"
                    value={`${avg_issue_resolution_time}d`}
                    icon={<Bug className="w-5 h-5" />}
                    color="purple"
                    sub="Days to close"
                />
                <ActionCard
                    label="Overdue Tasks"
                    value={overdue_tasks}
                    icon={<AlertCircle className="w-5 h-5" />}
                    color={overdue_tasks > 0 ? 'red' : 'green'}
                    sub={overdue_tasks > 0 ? 'Needs attention' : 'All on track'}
                />
            </div>
        </>
    );
}