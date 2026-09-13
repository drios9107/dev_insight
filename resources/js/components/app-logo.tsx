import { usePage } from '@inertiajs/react';

import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    const { name } = usePage().props;

    return (
        <>
            <img
                src="/logo.svg"
                alt="DevInsights"
                className="h-8 w-auto"
            />
        </>
    );
}
