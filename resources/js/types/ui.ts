import type * as SelectPrimitive from '@radix-ui/react-select';
import type { ReactNode } from 'react';
import type { BreadcrumbItem } from '@/types/navigation';

export type AppLayoutProps = {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
};

export type AppVariant = 'header' | 'sidebar';

export type FlashToast = {
    type: 'success' | 'info' | 'warning' | 'error';
    message: string;
};

export type AuthLayoutProps = {
    children?: ReactNode;
    name?: string;
    title?: string;
    description?: string;
};

export interface IHtmlWithLabel extends React.ComponentProps<'input'> {
    label?: string;
    labelClassName?: string;
    errors?: any;
}

export interface ICustomSelect extends React.ComponentProps<
    typeof SelectPrimitive.Root
> {
    id?: string;
    label?: string;
    list: ICustomSelectItem[];
    errors?: any;
    onChange: (v: string) => void;
    className?: string;
    side?: 'top' | 'right' | 'bottom' | 'left';
    placeholder?: string;
    addAll?: boolean;
    labelClassName?: string;
}

export interface ICustomSelectItem {
    value: string;
    label: string;
}
