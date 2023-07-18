import React, {
  MouseEvent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Flex,
  Box,
  Button,
  Select,
} from "@chakra-ui/react";

type DataTableHeaderItem = {
  id: string;
  label: string;
  sortable?: boolean;
  isNumeric?: boolean;
};

type LastSortedColumn = {
  id: string;
  ascending: boolean;
} | null;

type DataTableProps = {
  paginate?: boolean;
  caption?: string;
  headers: DataTableHeaderItem[];
  cols: any;
};

const tableRowsOptions = [10, 50, 100];

export default function DataTable({
  paginate = true,
  caption = "",
  cols = [],
  headers = [],
}: DataTableProps) {
  const [columns, setColumns] = useState(cols);
  const lastSortedColumn = useRef<LastSortedColumn>();
  const [defaultDataShow, setDefaultDataShow] = useState<number>(
    tableRowsOptions?.[0] || 10
  );
  const [startingIndexRange, setStartingIndexRange] = useState<number>(0);

  const handleDataChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value);
    setDefaultDataShow(value);
  };
  // paginated data to show based on paginate prop
  const data = useMemo(() => {
    if (columns?.length && paginate) {
      const startRange = startingIndexRange * defaultDataShow;
      const endRange = startRange + defaultDataShow;
      return columns.slice(startRange, endRange);
    } else if (!paginate) return columns;
    else return [];
  }, [defaultDataShow, startingIndexRange, paginate, columns]);

  const handleNextPrevButton = (
    e: MouseEvent<HTMLButtonElement> & {
      target: HTMLButtonElement;
    }
  ) => {
    const buttonText = e?.target?.innerText;
    switch (buttonText) {
      case "Next":
        setStartingIndexRange((prev) => prev + 1);
        return;
      case "Prev":
        setStartingIndexRange((prev) => prev - 1);
        return;
    }
  };

  // handle disable state for next & prev buttons
  const handleButtonsDisable = useMemo(() => {
    const isNextButtonDisabled =
      startingIndexRange * defaultDataShow + defaultDataShow >= columns.length;
    return {
      nextButton: isNextButtonDisabled,
      prevButton: !startingIndexRange,
    };
  }, [startingIndexRange, defaultDataShow, columns]);

  // sort data in ascending/descending order for columns
  const handleSortData = useCallback(
    (item: DataTableHeaderItem) => {
      if (item?.isNumeric || item.sortable === false) return;
      const prevColumnId = lastSortedColumn.current?.id;
      const sortingOrder =
        item.id === prevColumnId ? !lastSortedColumn.current?.ascending : true;
      lastSortedColumn.current = {
        id: item.id,
        ascending: sortingOrder,
      };
      let colItems = [...columns];
      if (lastSortedColumn.current.ascending) {
        const sortedData = colItems.sort((a: any, b: any) =>
          a[item.id].localeCompare(b[item.id])
        );
        setColumns(sortedData);
      } else {
        const sortedData = colItems.sort((a: any, b: any) =>
          b[item.id].localeCompare(a[item.id])
        );
        setColumns(sortedData);
      }
    },
    [columns]
  );

  return (
    <TableContainer boxShadow="md" width={"100%"}>
      <Table variant="striped">
        {caption ? <TableCaption>{caption}</TableCaption> : null}
        {/* table header component */}
        <Thead>
          <Tr>
            {headers.map((item: DataTableHeaderItem) => (
              <Th
                key={item.id}
                isNumeric={item?.isNumeric || false}
                cursor={
                  item?.isNumeric || item.sortable === false
                    ? "default"
                    : "pointer"
                }
                onClick={() => handleSortData(item)}
              >
                {item.label}
              </Th>
            ))}
          </Tr>
        </Thead>
        {/* table body component */}
        <Tbody>
          {data.map((item: any, index: number) => {
            return (
              <Tr key={`item-col-${index}`}>
                {Object.keys(item).map((key, index) => (
                  <Td key={index}>{item[key]}</Td>
                ))}
                <Td>
                  <Button>Select</Button>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      {/* Pagination and view change for table */}
      {paginate ? (
        <Flex justifyContent={"flex-end"} mx={"12"} mb={"5"}>
          <Select
            width={20}
            value={defaultDataShow}
            onChange={handleDataChange}
          >
            {tableRowsOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
          <Box mx={"2"}></Box>
          <Button
            colorScheme="gray"
            variant="link"
            isDisabled={handleButtonsDisable.prevButton}
            onClick={handleNextPrevButton}
          >
            Prev
          </Button>
          <Box mx={"2"}></Box>
          <Button
            colorScheme="blue"
            variant="link"
            isDisabled={handleButtonsDisable.nextButton}
            onClick={handleNextPrevButton}
          >
            Next
          </Button>
        </Flex>
      ) : null}
    </TableContainer>
  );
}
