import React from 'react'

const Table = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
      <table
        ref={ref}
        className={["w-full caption-bottom text-sm", className].filter(Boolean).join(" ")}
        {...props}
      >
        {children}
      </table>
    </div>
  )
)
Table.displayName = "Table"

const TableHeader = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <thead ref={ref} className={["border-b border-tea-100 dark:border-tea-800 bg-tea-50/50 dark:bg-tea-800/30", className].filter(Boolean).join(" ")} {...props}>
      {children}
    </thead>
  )
)
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <tbody ref={ref} className={["divide-y divide-tea-100 dark:divide-tea-800", className].filter(Boolean).join(" ")} {...props}>
      {children}
    </tbody>
  )
)
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <tfoot ref={ref} className={["border-t border-tea-100 dark:border-tea-800 bg-tea-50/50 dark:bg-tea-800/30 font-medium", className].filter(Boolean).join(" ")} {...props}>
      {children}
    </tfoot>
  )
)
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <tr
      ref={ref}
      className={[
        "border-b border-tea-100 dark:border-tea-800 transition-colors hover:bg-tea-50/50 dark:hover:bg-tea-800/30 data-[state=selected]:bg-tea-100/50",
        className,
      ].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
    </tr>
  )
)
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <th
      ref={ref}
      className={[
        "h-12 px-4 text-left align-middle font-semibold text-tea-600 dark:text-tea-300",
        "bg-tea-50/50 dark:bg-tea-800/30",
        className,
      ].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
    </th>
  )
)
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <td
      ref={ref}
      className={["p-4 align-middle text-tea-900 dark:text-tea-100", className].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
    </td>
  )
)
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <caption ref={ref} className={["mt-4 text-sm text-tea-500", className].filter(Boolean).join(" ")} {...props}>
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
