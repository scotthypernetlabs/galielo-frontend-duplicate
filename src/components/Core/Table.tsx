import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel
} from "@material-ui/core";
import { TableHeaderId, TableHeaders } from "../Jobs/Jobs";
import React from "react";

interface TableProps {
  tableHeaders: TableHeaders[];
  tableBodyItems: JSX.Element[];
  orderBy: TableHeaderId;
  order: "asc" | "desc";
  sortHandler: any;
  showSort?: boolean;
}

const CustomTable: React.SFC<TableProps> = (props: TableProps) => {
  const {
    tableHeaders,
    tableBodyItems,
    orderBy,
    order,
    sortHandler,
    showSort
  } = props;
  return (
    <TableContainer>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            {tableHeaders.map(headCell => (
              <TableCell
                key={headCell.id}
                align={headCell.align}
                sortDirection={orderBy === headCell.id ? order : false}
              >
                {showSort == null && headCell.sort ? (
                  <TableSortLabel
                    active={headCell.sort && orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : "asc"}
                    onClick={sortHandler(headCell.id as TableHeaderId)}
                  >
                    {headCell.label}
                  </TableSortLabel>
                ) : (
                  headCell.label
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {tableBodyItems.map((item: JSX.Element) => {
            return item;
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CustomTable;
