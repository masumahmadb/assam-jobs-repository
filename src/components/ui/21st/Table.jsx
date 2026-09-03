import React from 'react'

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, children, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
      <table
        ref={ref}
        className={["w-full caption-bottom text-sm", className].filter(Boolean).join(" ")}
        {...props}
        ref={ref}
      >
        {children}
      </table>
    </div>
  )
)
Table.displayName = "Table"

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, children, ...props }, ref) => (
    <thead ref={ref} className={["border-b border-tea-100 bg-tea-50/50", className].filter(Boolean).join(" ")} {...props} ref={ref}>
      {children}
    </thead>
  )
)
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, children, ...props }, ref) => (
    <tbody ref={ref} className={["divide-y divide-tea-100", className].filter(Boolean).join(" ")} {...props} ref={ref}>
      {children}
    </tbody>
  )
)
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, children, ...props }, ref) => (
    <tfoot ref={ref} className={["border-t bg-tea-50/50 font-medium", className].filter(Boolean).join(" ")} {...props} ref={ref}>
      {children}
    </tfoot>
  )
)
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, children, ...props }, ref) => (
    <tr
      ref={ref}
      className={[
        "border-b border-tea-100 transition-colors hover:bg-tea-50/50 data-[state=selected]:bg-tea-100/50",
        className,
      ].filter(Boolean).join(" ")
      {...props}
      ref={ref}
    >
      {children}
    </tr>
  )
)
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, children, ...props }, ref) => (
    <th
      ref={ref}
      className={[
        "h-12 px-4 text-left align-middle font-semibold text-tea-600",
        "bg-tea-50/50",
        className,
      ].filter(Boolean).join(" ")
      {...props}
      ref={ref}
    >
      {children}
    </th>
  )
)
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, children, ...props }, ref) => (
    <td
      ref={ref}
      className={["p-4 align-middle text-tea-900", className].filter(Boolean).join(" ")}
      {...props}
      ref={ref}
    >
      {children}
    </td>
  )
)
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className, children, ...props }, ref) => (
    <caption ref={ref} className={["mt-4 text-sm text-tea-500", className].filter(Boolean).join(" ")} {...props} ref={ref}>
      {children}
    </caption>
  )
)
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}