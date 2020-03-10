import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@material-ui/core";
import React from "react";

export type TableHeader = {
  [key: string]: "inherit" | "left" | "center" | "right" | "justify";
};

interface TableProps {
  tableHeaders: TableHeader[];
  tableBodyItems: JSX.Element[];
}

const CustomTable: React.SFC<TableProps> = (props: TableProps) => {
  const { tableHeaders, tableBodyItems } = props;
  return (
    <TableContainer>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            {tableHeaders.map((header: TableHeader) => {
              const title: string = Object.keys(header)[0];
              const align: "inherit" | "left" | "center" | "right" | "justify" =
                header[title];
              return (
                <TableCell key={title} align={align}>
                  {title}
                </TableCell>
              );
            })}
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
