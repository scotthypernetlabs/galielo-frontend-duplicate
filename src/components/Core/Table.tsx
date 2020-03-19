import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel
} from "@material-ui/core";
import { TableHeaderId, TableHeaders } from "../Jobs/Jobs";
import React from "react";

interface TableProps {
  numberOfJobs?: number;
  tableHeaders: TableHeaders[];
  tableBodyItems: JSX.Element[];
  orderBy: TableHeaderId;
  order: "asc" | "desc";
  sortHandler: any;
  showSort?: boolean;
}

const CustomTable: React.SFC<TableProps> = (props: TableProps) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const {
    numberOfJobs,
    tableHeaders,
    tableBodyItems,
    orderBy,
    order,
    sortHandler,
    showSort
  } = props;
  return (
    <Paper>
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
            {tableBodyItems
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item: JSX.Element) => {
                return item;
              })}
          </TableBody>
        </Table>
      </TableContainer>
      {numberOfJobs && (
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={tableBodyItems.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      )}
    </Paper>
  );
};
export default CustomTable;
