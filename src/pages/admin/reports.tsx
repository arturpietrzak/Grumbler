import { Table, Pagination, Modal, Text, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Head from "next/head";
import { useEffect, useState } from "react";
import { ArrowsSort, Ban, ThumbUp } from "tabler-icons-react";
import { Loader } from "../../components/Loader";
import { AdminPost } from "../../components/AdminPost/AdminPost";
import { api } from "../../utils/api";

import styles from "./AdminPage.module.scss";

export default function ReportsPage() {
  const [page, setPage] = useState(1);
  const [sortOption, setSortOption] = useState("asc");
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedReport, setSelectedReport] = useState("");
  const reviewReportMutation = api.admin.reviewReport.useMutation();

  const { data: reportsData, refetch: refetchReportsData } =
    api.admin.getReports.useQuery({
      page: page,
      sortOption,
    });

  const { data: selectedReportData, refetch: selectedReportDataRefetch } =
    api.admin.getReportedPost.useQuery(
      {
        reportId: selectedReport,
      },
      {
        enabled: false,
      }
    );

  useEffect(() => {
    if (selectedReport) {
      selectedReportDataRefetch();
    }
  }, [selectedReport, selectedReportDataRefetch]);

  if (!reportsData) {
    return <Loader />;
  }

  return (
    <>
      <Head>
        <title>Grumbler | Resolve reports</title>
      </Head>
      <Modal
        opened={opened}
        onClose={close}
        title="Review"
        className={styles.modal}
      >
        {selectedReportData && (
          <AdminPost
            content={selectedReportData.post.content}
            extendedContent={
              selectedReportData.post.extendedContent ?? undefined
            }
          />
        )}
        <div className={styles.actionsContainer}>
          <button
            className={styles.positive}
            onClick={async () => {
              await reviewReportMutation.mutateAsync({
                reportId: selectedReport,
                shouldPostBeRemoved: false,
              });
              refetchReportsData();
              setSelectedReport("");
              close();
            }}
          >
            <ThumbUp size={20} />
            <Text>Leave</Text>
          </button>
          <button
            className={styles.danger}
            onClick={async () => {
              await reviewReportMutation.mutateAsync({
                reportId: selectedReport,
                shouldPostBeRemoved: true,
              });
              refetchReportsData();
              setSelectedReport("");
              close();
            }}
          >
            <Ban size={20} />
            <span>Remove</span>
          </button>
        </div>
      </Modal>
      <ReportsTable
        onReviewClick={(id) => {
          setSelectedReport(id);
          open();
        }}
        onSortClick={() => {
          setSortOption((prev) => (prev === "asc" ? "desc" : "asc"));
        }}
        reports={[...reportsData.reports]}
      />
      <Pagination
        total={reportsData.pages}
        value={page}
        onChange={setPage}
        sx={{ position: "fixed", bottom: 16, right: 16 }}
      />
    </>
  );
}

function ReportsTable({
  reports,
  onSortClick,
  onReviewClick,
}: {
  reports: {
    id: string;
    postId: string;
    createdAt: string;
    reason: string;
  }[];
  onSortClick: () => void;
  onReviewClick: (id: string) => void;
}) {
  const ths = (
    <tr>
      <th className={styles.sortHeader} onClick={onSortClick}>
        <ArrowsSort size={12} style={{ marginRight: 6 }} />
        Reported at
      </th>
      <th>Reason</th>
      <th>Action</th>
    </tr>
  );

  const rows = reports.map((r) => (
    <tr key={r.id}>
      <td className={styles.narrowField}>{r.createdAt}</td>
      <td className={styles.elipsisField}>{r.reason}</td>
      <td className={styles.narrowField}>
        <Button variant="outline" onClick={() => onReviewClick(r.id)}>
          Review
        </Button>
      </td>
    </tr>
  ));

  return (
    <Table className={styles.table}>
      <thead>{ths}</thead>
      <tbody>{rows}</tbody>
    </Table>
  );
}
