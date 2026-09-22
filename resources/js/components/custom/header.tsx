import { Plus } from 'lucide-react';
import { Button } from '../ui/button';

interface IHeader {
    title: string;
    onClick?: () => void;
    children?: React.ReactNode;
}

const Header = ({ title = '', onClick, children }: IHeader) => {
    return (
        <div className="m-6 flex items-center justify-between">
            <h1>{title}</h1>
            {onClick && (
                <Button
                    variant="outline"
                    className="text-green-600"
                    onClick={onClick}
                >
                    <Plus className="h-4 w-4" />
                </Button>
            )}
            {children}
        </div>
    );
};

export default Header;
