import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Text } from '@radix-ui/themes'
import { Button } from '@/components/ui/button'
import ShadSelect from '../inputs/shad-select'
import { useMemo } from 'react'

interface IDataTablePagination {
    currentPage: number
    total: number
    perPage: number
    onPageChange: (v: number) => void
    onPerPageChange: (v: number) => void
    perPageOptions?: number[]
}

export function DataTablePagination({
    currentPage,
    total,
    perPage,
    onPageChange,
    onPerPageChange,
    perPageOptions = [5, 10, 25, 50, 100],
}: IDataTablePagination) {
    const totalPages = Math.ceil(total / perPage)
    const from = (currentPage - 1) * perPage + 1
    const to = Math.min(currentPage * perPage, total)

    const options = useMemo(() => perPageOptions.map(opt => ({ value: `${opt}`, label: `${opt}` })), [perPageOptions])
    if (total === 0) return null

    return (
        <div className="flex flex-wrap w-full items-center justify-between mt-6 p-3 border rounded-md bg-white shadow-sm">
            {/* Left side */}
            <div className="flex justify-start items-center gap-3" style={{ width: 250 }}>
                <div className="text-gray-600 flex flex-col flex-1" style={{ width: 'max-content' }}>
                    <span className="font-medium text-black">{from} - {to}</span>
                    <span className="whitespace-nowrap">Total: {total}</span>
                </div>

                <ShadSelect
                    name="perPage"
                    value={String(perPage)}
                    onChange={(val: string) => onPerPageChange(parseInt(val))}
                    list={options}
                    side='top'
                />

                <span className="text-gray-600 flex-1 whitespace-nowrap" style={{ width: 'max-content' }}>per page</span>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
                <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage <= 1}
                    onClick={() => onPageChange(currentPage - 1)}
                >
                    <ChevronLeft className="w-4 h-4" />
                </Button>

                <Text size="2" className="text-black">
                    Página <span className="font-medium">{currentPage}</span> de {totalPages || 1}
                </Text>

                <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage >= totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                >
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    )
}
