import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button, Flex, Text, Select } from '@radix-ui/themes';

interface IDataTablePagination {
    currentPage: number;
    total: number;
    perPage: number;
    onPageChange: (v: any) => void
    onPerPageChange: (v: any) => void
    perPageOptions?: number[]
}

export function DataTablePagination({
    currentPage,
    total,
    perPage,
    onPageChange,
    onPerPageChange,
    perPageOptions = [10, 25, 50, 100],
}: IDataTablePagination) {
    const totalPages = Math.ceil(total / perPage);
    const from = (currentPage - 1) * perPage + 1;
    const to = Math.min(currentPage * perPage, total);

    if (total === 0) return null;

    return (
        <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
            <Flex align="center" gap="2">
                <Text size="2" color="gray">
                    Mostrando {from} - {to} de {total}
                </Text>
                <Select.Root
                    value={String(perPage)}
                    onValueChange={(value) => onPerPageChange(Number(value))}
                >
                    <Select.Trigger className="w-20" />
                    <Select.Content>
                        {perPageOptions.map((option) => (
                            <Select.Item key={option} value={String(option)}>
                                {option}
                            </Select.Item>
                        ))}
                    </Select.Content>
                </Select.Root>
                <Text size="2" color="gray">por página</Text>
            </Flex>

            <Flex align="center" gap="2">
                <Button
                    variant="outline"
                    size="1"
                    disabled={currentPage <= 1}
                    onClick={() => onPageChange(currentPage - 1)}
                >
                    <ChevronLeft className="w-4 h-4" />
                </Button>

                <Text size="2">
                    Página {currentPage} de {totalPages || 1}
                </Text>

                <Button
                    variant="outline"
                    size="1"
                    disabled={currentPage >= totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                >
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </Flex>
        </div>
    );
}