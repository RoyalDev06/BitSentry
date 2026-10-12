import { useMemo } from 'react';
import {
  createSortedRowModel,
  rowSortingFeature,
  sortFns,
  tableFeatures,
  useTable,
  type ColumnDef,
} from '@tanstack/react-table';
import { Link, useNavigate } from 'react-router-dom';
import type { CaseDetail } from '../../types/cases';
import RiskBadge from '../ui/RiskBadge';
import { formatCaseDate, statusClasses, statusLabel } from './caseUtils';

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns,
});

interface CasesTableProps {
  cases: CaseDetail[];
}

export default function CasesTable({ cases }: CasesTableProps) {
  const navigate = useNavigate();

  const columns = useMemo<ColumnDef<typeof features, CaseDetail>[]>(
    () => [
      {
        id: 'id',
        accessorKey: 'id',
        header: 'Case',
        cell: (info) => (
          <Link
            to={`/cases/${info.row.original.id}`}
            className="font-mono text-xs font-semibold text-brand-teal hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {info.row.original.id}
          </Link>
        ),
      },
      {
        id: 'title',
        accessorKey: 'title',
        header: 'Title',
        cell: (info) => (
          <span className="text-sm font-medium text-text-primary">{info.row.original.title}</span>
        ),
      },
      {
        id: 'priority',
        accessorKey: 'priority',
        header: 'Priority',
        cell: (info) => <RiskBadge level={info.row.original.priority} />,
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: 'Status',
        cell: (info) => {
          const status = info.row.original.status;
          return (
            <span
              className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusClasses[status]}`}
            >
              {statusLabel[status]}
            </span>
          );
        },
      },
      {
        id: 'assignedTo',
        accessorKey: 'assignedTo',
        header: 'Assigned',
        cell: (info) => (
          <span className="text-sm text-text-secondary">
            {info.row.original.assignedTo ?? 'Unassigned'}
          </span>
        ),
      },
      {
        id: 'updatedAt',
        accessorKey: 'updatedAt',
        header: 'Updated',
        cell: (info) => (
          <span className="text-sm text-text-muted">
            {formatCaseDate(info.row.original.updatedAt)}
          </span>
        ),
      },
      {
        id: 'actions',
        header: 'Action',
        cell: (info) => (
          <Link
            to={`/cases/${info.row.original.id}`}
            onClick={(e) => e.stopPropagation()}
            className="font-medium text-brand-orange hover:underline text-xs"
          >
            Investigate →
          </Link>
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
    initialState: {
      sorting: [{ id: 'updatedAt', desc: true }],
    },
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
                  style={{
                    cursor: header.column.getCanSort() ? 'pointer' : 'default',
                    userSelect: 'none',
                  }}
                >
                  {header.isPlaceholder ? null : (
                    <span className="inline-flex items-center gap-1">
                      <table.FlexRender header={header} />
                      {header.column.getIsSorted() === 'asc' && '↑'}
                      {header.column.getIsSorted() === 'desc' && '↓'}
                    </span>
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
              onClick={() => navigate(`/cases/${row.original.id}`)}
              className="cursor-pointer transition-colors hover:bg-background-hover"
            >
              {row.getAllCells().map((cell) => (
                <td key={cell.id} className="py-3 pr-4">
                  <table.FlexRender cell={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}