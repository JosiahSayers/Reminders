import { useState } from "react";
import type { Quote } from "../../prisma/generated/client";
import useAxios from "axios-hooks";
import {
  Button,
  Group,
  Loader,
  Pagination,
  Stack,
  Table,
  Text,
} from "@mantine/core";
import DeleteQuoteButton from "./delete-button";
import { modals } from "@mantine/modals";
import CreateQuoteModal from "../modals/create-quote-modal";
import PrintQuoteButton from "./print-now-button";

type ApiData = {
  quotes: Array<Quote>;
  totalQuoteSize: number;
  totalPages: number;
  currentPage: number;
};

export default function QuotesPage() {
  const [page, setPage] = useState(1);
  const [{ data, loading }, refetch] = useAxios<ApiData>(
    {
      url: "/api/quotes",
      params: { page },
    },
    { useCache: false },
  );

  if (loading) {
    return <Loader size="xl" />;
  }

  const openNewQuoteModal = () => {
    const modalId = modals.open({
      title: "New Quote",
    });

    modals.updateModal({
      modalId,
      children: (
        <CreateQuoteModal
          onSuccess={() => {
            modals.close(modalId);
            refetch();
          }}
        />
      ),
    });
  };

  return (
    <Stack>
      <Group justify="flex-end">
        <Button onClick={openNewQuoteModal} variant="gradient">
          New Quote
        </Button>
      </Group>

      <Table stickyHeader stickyHeaderOffset={60} highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Quote</Table.Th>
            <Table.Th>Author</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {data!.quotes.map((quote) => (
            <Table.Tr key={quote.id}>
              <Table.Td>
                <Text w="50vw">{quote.quote}</Text>
              </Table.Td>
              <Table.Td width="fit-content">{quote.author}</Table.Td>
              <Table.Td>
                <Group wrap="nowrap">
                  <PrintQuoteButton quoteId={quote.id} />
                  <DeleteQuoteButton quoteId={quote.id} onSuccess={refetch} />
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Group justify="space-between">
        <Pagination total={data!.totalPages} value={page} onChange={setPage} />
        <Text>
          {data!.totalQuoteSize} {data!.totalQuoteSize > 1 ? "quotes" : "quote"}
        </Text>
      </Group>
    </Stack>
  );
}
