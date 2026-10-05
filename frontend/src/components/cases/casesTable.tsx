import { useMemo } from 'react';
import {
  createSortedRowModel,
  flexRender,
  rowSortingFeature,
  sortFns,
  tableFeatures,
  useTable,
} from '@tanstack/react-table';
import type { ColumnDef } from '@tanstack/react-table';
import { Link } from 'react-router-dom';
import type { Case } from '../../types/cases';
import RiskBadge from '../ui/RiskBadge';
import { formatCaseDate, statusClasses, statusLabel } from './caseUtils';

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
});

interface CasesTableProps {
  cases: Case[];
}

export default function CasesTable({ cases }: CasesTableProps) {
  const columns = useMemo<ColumnDef<typeof features, Case>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'Case',
        cell: (info) => (
          <Link
            to="/cases"
            className="font-mono text-xs text-brand-teal hover:underline"
          >
            {info.getValue<string>()}
          </Link>
        ),
      },
      {
        accessorKey: 'title',
        header: 'Title',
        cell: (info) => (
          <span className="text-sm text-text-primary">
            {info.getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: 'priority',
        header: 'Priority',
        cell: (info) => <RiskBadge level={info.getValue<Case['priority']>()} />,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: (info) => {
          const status = info.getValue<Case['status']>();
          return (
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusClasses[status]}`}
            >
              {statusLabel[status]}
            </span>
          );
        },
      },
      {
        accessorKey: 'alertCount',
        header: 'Alerts',
        cell: (info) => (
          <span className="text-sm text-text-secondary">
            {info.getValue<number>()}
          </span>
        ),
      },
      {
        accessorKey: 'assignedTo',
        header: 'Assigned',
        cell: (info) => (
          <span className="text-sm text-text-secondary">
            {info.getValue<string | null>() ?? 'Unassigned'}
          </span>
        ),
      },
      {
        accessorKey: 'updatedAt',
        header: 'Updated',
        cell: (info) => (
          <span className="text-sm text-text-muted">
            {formatCaseDate(info.getValue<string>())}
          </span>
        ),
      },
    ],
    [],
  );

  const table = useTable({
    key: 'cases-table',
    features,
    columns,
    data: cases,
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              key={headerGroup.id}
              className="border-b border-border-subtle text-xs uppercase text-text-muted"
            >
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="py-2 pr-4 font-medium"
                  onClick={header.column.getToggleSortingHandler()}
                  style={{ cursor: header.column.getCanSort() ? 'pointer' : 'default' }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-border-subtle">
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="transition-colors hover:bg-background-hover"
            >
              {row.getAllCells().map((cell) => (
                <td key={cell.id} className="py-3 pr-4">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}