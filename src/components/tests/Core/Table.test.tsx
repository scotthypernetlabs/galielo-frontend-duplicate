import { TableCell, TableHead, TableRow } from "@material-ui/core";
import { TableHeaderId, TableHeaders } from "../../Jobs/Jobs";
import { mount } from "enzyme";
import CustomTable from "../../Core/Table";
import Job from "../../Jobs/Job";
import React from "react";

describe("CustomTable Component", () => {
  const tableHeaders: TableHeaders[] = [];
  const tableBodyItems: JSX.Element[] = [
    <TableRow key={1}>
      <TableCell>1</TableCell>
      <TableCell>2</TableCell>
      <TableCell>3</TableCell>
    </TableRow>,
    <TableRow key={2}>
      <TableCell>4</TableCell>
      <TableCell>5</TableCell>
      <TableCell>6</TableCell>
    </TableRow>,
    <TableRow key={3}>
      <TableCell>7</TableCell>
      <TableCell>8</TableCell>
      <TableCell>9</TableCell>
    </TableRow>
  ];
  const order: "asc" | "desc" = "asc";
  const componentProps = {
    tableHeaders,
    tableBodyItems,
    order,
    orderBy: TableHeaderId.SentTo,
    sortHandler: jest.fn()
  };

  const Wrapper = (props: any) => {
    return <CustomTable {...componentProps} />;
  };

  const customTable = mount(<Wrapper />);

  it("table headers should be correct", () => {
    expect(customTable.find(TableRow)).toHaveLength(4);
    for (let i = 0; i < tableHeaders.length; i++) {
      expect(
        customTable
          .find(TableCell)
          .at(i)
          .text()
      ).toBe(Object.keys(tableHeaders[i])[0]);
    }
  });

  it("table body should be correct", () => {
    for (
      let i = tableHeaders.length;
      i < tableHeaders.length + tableBodyItems.length;
      i++
    ) {
      expect(
        customTable
          .find(TableCell)
          .at(i)
          .text()
      ).toBe((i - tableHeaders.length + 1).toString());
    }
  });

  it("should match snapshot", () => {
    expect(customTable).toMatchSnapshot();
  });
});
