interface DetailItemProps {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value?: string | number | null;
}

function DetailItem({ icon: Icon, label, value }: DetailItemProps) {
    return (
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="p-2 rounded-lg bg-gray-100 text-gray-600">
                <Icon className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-sm font-medium text-gray-900 truncate">
                    {value || '-'}
                </p>
            </div>
        </div>
    );
}

export default DetailItem;