interface DetailItemProps {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value?: string | number | null;
}

function DetailItem({ icon: Icon, label, value }: DetailItemProps) {
    return (
        <div className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50">
            <div className="rounded-lg bg-gray-100 p-2 text-gray-600">
                <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500">{label}</p>
                <p className="truncate text-sm font-medium text-gray-900">
                    {value || '-'}
                </p>
            </div>
        </div>
    );
}

export default DetailItem;
