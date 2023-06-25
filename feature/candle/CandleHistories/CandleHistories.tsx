import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useQueryClient } from '@tanstack/react-query';
import AlertDialog from 'components/AlertDialog/AlertDialog';
import MessageDialog from 'feature/candle/MessageDialog/MessageDialog';
import { deleteArrow, putArrow } from 'helpers/axios';
import useArrows, { ARROWS_QUERY_KEY } from 'hooks/api/useArrows';
import useArrowsCount from 'hooks/api/useArrowsCount';
import { ARROWS_INFINITE_QUERY_KEY } from 'hooks/api/useArrowsInfinite';
import useAuth from 'hooks/auth/useAuth';
import { useState } from 'react';

import MessageItem from './MessageItem';

type Dialog = {
  id: string;
  open: boolean;
};

const ITEM_COUNT_PER_PAGE = 20;

const CandleHistories = () => {
  const queryClient = useQueryClient();

  const { user: me } = useAuth();

  const [page, setPage] = useState(1);
  const [messageDialog, setMessageDialog] = useState<Dialog | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<Dialog | null>(null);

  const { data: arrowsCountData } = useArrowsCount();
  const { data: arrowsData } = useArrows({
    skip: ITEM_COUNT_PER_PAGE * (page - 1),
    limit: ITEM_COUNT_PER_PAGE,
  });

  const refetch = () => {
    queryClient.invalidateQueries({
      queryKey: [ARROWS_QUERY_KEY],
    });
    queryClient.invalidateQueries({
      queryKey: [ARROWS_INFINITE_QUERY_KEY],
    });
  };

  const editCandle = async (message: string) => {
    if (!messageDialog?.id) return;

    const arrowId = messageDialog.id;
    setMessageDialog(null);
    const trimedMessage = message.trim();

    try {
      await putArrow(arrowId, {
        message: trimedMessage,
      });
      refetch();
    } catch {
      //
    }
  };

  const deleteCandle = async () => {
    if (!deleteDialog?.id) return;

    const arrowId = deleteDialog.id;
    setDeleteDialog(null);

    try {
      await deleteArrow(arrowId);
      refetch();
    } catch {
      //
    }
  };

  const handleEdit = (id: string) => {
    setMessageDialog({ open: true, id });
  };

  const handleDelete = (id: string) => {
    setDeleteDialog({ open: true, id });
  };

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  return (
    <>
      <Box bgcolor="#000">
        <Container>
          <Stack gap={1}>
            {arrowsData?.arrows.map((arrow) => (
              <MessageItem
                key={arrow._id}
                message={arrow.message}
                profileImageUrl={arrow.user.imageUrl}
                name={arrow.user.name}
                createdAt={arrow.createdAt}
                isMyself={arrow.userId === me?._id}
                onEdit={() => handleEdit(arrow._id)}
                onDelete={() => handleDelete(arrow._id)}
              />
            ))}
            <Box display="flex" justifyContent="center">
              {(arrowsCountData?.count ?? 0) <= ITEM_COUNT_PER_PAGE ? null : (
                <Pagination
                  page={page}
                  onChange={(_, page) => handlePageChange(page)}
                  count={Math.ceil(
                    Number(arrowsCountData?.count) / ITEM_COUNT_PER_PAGE
                  )}
                />
              )}
            </Box>
          </Stack>
        </Container>
      </Box>

      <AlertDialog
        open={!!deleteDialog}
        title="삭제 확인"
        description="기도를 삭제하시겠습니까?"
        onClose={() => setDeleteDialog(null)}
        onSubmit={deleteCandle}
        color="error"
      />

      <MessageDialog
        id={messageDialog?.id}
        open={!!messageDialog}
        title="화살기도 수정"
        onClose={() => setMessageDialog(null)}
        onSubmit={editCandle}
      />
    </>
  );
};

export default CandleHistories;
