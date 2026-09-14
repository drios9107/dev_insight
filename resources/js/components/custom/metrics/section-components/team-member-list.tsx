// resources/js/components/metrics/TeamMembersList.tsx

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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
    title?: string;
}

const statusMap = {
    active: { label: 'Active', className: 'bg-green-100 text-green-800' },
    idle: { label: 'Idle', className: 'bg-yellow-100 text-yellow-800' },
    away: { label: 'Away', className: 'bg-red-100 text-red-800' },
};

export function TeamMembersList({ members, title = 'Team Members' }: TeamMembersListProps) {
    return (
        <CardSectionWrapper className="lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-md">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold text-gray-700">
                        👥 {title}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                        {members.map((member, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    <Avatar className="w-9 h-9 flex-shrink-0">
                                        <AvatarImage src={member.avatar || undefined} />
                                        <AvatarFallback>
                                            {member.name.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium text-gray-900 truncate">{member.name}</p>
                                            <Badge variant="outline" className={statusMap[member.status].className}>
                                                {statusMap[member.status].label}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-gray-400 truncate">@{member.username}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-sm flex-shrink-0 ml-2">
                                    <span className="text-gray-600">{member.commits} commits</span>
                                    <span className="text-gray-400 hidden sm:inline">·</span>
                                    <span className="text-gray-600 hidden sm:inline">{member.prs} PRs</span>
                                    <span className="text-gray-400 hidden md:inline">·</span>
                                    <span className="text-gray-600 hidden md:inline">{member.reviews} reviews</span>
                                    <span className="text-xs text-gray-400 ml-1 hidden lg:inline">
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