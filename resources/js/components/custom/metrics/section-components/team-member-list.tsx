import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import CardSectionWrapper from './card-section-wrapper';

interface TeamMember {
    name: string;
    username: string;
    avatar: string | null;
    commits: number;
    prs: number;
    reviews: number;
    last_active: string;
    status: 'active' | 'idle' | 'away';
}

interface TeamMembersListProps {
    members: TeamMember[];
}

const statusMap = {
    active: { label: 'Active', className: 'bg-green-100 text-green-800' },
    idle: { label: 'Idle', className: 'bg-yellow-100 text-yellow-800' },
    away: { label: 'Away', className: 'bg-red-100 text-red-800' },
};

export function TeamMembersList({ members }: TeamMembersListProps) {
    return (
        <CardSectionWrapper className="gap-6 lg:grid-cols-2">
            <Card className="border-0 shadow-md">
                <CardContent className="p-4">
                    <div className="max-h-[400px] space-y-3 overflow-y-auto pr-1">
                        {members.map((member, index) => (
                            <div
                                key={index}
                                className="flex w-full items-center justify-between gap-4 rounded-lg p-2 hover:bg-gray-50"
                            >
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage
                                            src={member.avatar || undefined}
                                        />
                                        <AvatarFallback>
                                            {member.name
                                                .charAt(0)
                                                .toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex max-w-[160px] min-w-0 items-center gap-2">
                                        <p className="font-medium text-gray-900">
                                            {member.name}
                                        </p>
                                        <Badge
                                            variant="outline"
                                            className={
                                                statusMap[member.status]
                                                    .className
                                            }
                                        >
                                            {statusMap[member.status].label}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="ml-2 flex scrollbar-none items-center gap-4 overflow-x-auto text-sm whitespace-nowrap">
                                    <span className="text-gray-600">
                                        {member.commits} commits
                                    </span>
                                    <span className="text-gray-600">
                                        {member.prs} PRs
                                    </span>
                                    <span className="text-gray-600">
                                        {member.reviews} reviews
                                    </span>
                                    <span className="ml-1 text-xs text-gray-400">
                                        {member.last_active}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </CardSectionWrapper>
    );
}
