import 'swiper/css';

import AddIcon from '@mui/icons-material/Add';
import { IconButton } from '@mui/material';
import Box from '@mui/material/Box';
import { useQueryClient } from '@tanstack/react-query';
import AlertDialog from 'components/AlertDialog/AlertDialog';
import { deleteArrow, postArrow, putArrow } from 'helpers/axios';
import { ARROWS_QUERY_KEY } from 'hooks/api/useArrows';
import useArrowsInfinite from 'hooks/api/useArrowsInfinite';
import useAuth from 'hooks/auth/useAuth';
import cloneDeep from 'lodash/cloneDeep';
import { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import { assignValue, assignValues, createEmptyBoard } from 'utils/board';

import MessageDialog from '../MessageDialog';
import CandlesSlide from './CandlesSlide';
import { useCandlesRowColumnCount } from './hooks';
import { Candle } from './types';

type Dialog = {
  id?: string;
  open: boolean;
};

const Candles: React.FC = () => {
  const queryClient = useQueryClient();
  const { user: me } = useAuth();

  const divRef = useRef<HTMLDivElement>(null);

  const [boards, setBoards] = useState<(Candle | null)[][][]>([]);
  const [page, setPage] = useState(1);

  const [messageDialog, setMessageDialog] = useState<Dialog | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<Dialog | null>(null);

  const { rowCount, columnCount } = useCandlesRowColumnCount({ ref: divRef });
  const maxCandleCount =
    rowCount && columnCount
      ? Math.round(columnCount * rowCount * 0.4)
      : undefined;

  const { data: arrowsData, fetchNextPage } = useArrowsInfinite({
    limit: maxCandleCount,
  });

  // 다음 페이지 데이터 호출
  useEffect(() => {
    if (arrowsData && arrowsData.pages.length <= page) {
      fetchNextPage();
    }
  }, [arrowsData, page, fetchNextPage]);

  // arrowsData 또는 화면 크기가 달라지면 board를 새로 생성한다.
  useEffect(() => {
    if (arrowsData && rowCount && columnCount) {
      const boards = arrowsData.pages.map((arrowData) => {
        const board = createEmptyBoard(rowCount, columnCount);
        assignValues(board, arrowData.arrows);
        return board;
      });
      setBoards(boards);
    }
  }, [rowCount, columnCount, arrowsData]);

  const changeCandleMessage = (
    board: (Candle | null)[][],
    _id: string,
    message: string
  ) => {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j]?._id === _id) {
          const candle = board[i][j] as Candle;
          candle.message = message;
          return;
        }
      }
    }
  };

  const changeCandle = (
    board: (Candle | null)[][],
    _id: string,
    value: Candle | null
  ) => {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j]?._id === _id) {
          board[i][j] = value;
          return;
        }
      }
    }
  };

  const refetch = () => {
    queryClient.invalidateQueries({
      queryKey: [ARROWS_QUERY_KEY],
    });
  };

  const addCandle = async (message: string) => {
    if (!me || message.length === 0) return;
    setMessageDialog(null);
    const trimedMessage = message.trim();

    try {
      const result = await postArrow({
        message: trimedMessage,
        userId: me._id,
      });
      refetch();
      setBoards((boards) => {
        const newBoards = cloneDeep(boards);
        const newBoard = newBoards[0];
        assignValue(newBoard, {
          _id: String(result.insertedId),
          message: trimedMessage,
          user: me,
          userId: me._id,
          createdAt: new Date(),
        });
        return newBoards;
      });
    } catch {
      //
    }
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
      setBoards((boards) => {
        const newBoards = cloneDeep(boards);
        const newBoard = newBoards[page - 1];
        changeCandleMessage(newBoard, arrowId, trimedMessage);
        return newBoards;
      });
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
      setBoards((boards) => {
        const newBoards = cloneDeep(boards);
        const newBoard = newBoards[page - 1];
        changeCandle(newBoard, arrowId, null);
        return newBoards;
      });
    } catch {
      //
    }
  };

  const handleSlideChange = (swiper: SwiperClass) => {
    setPage(swiper.activeIndex + 1);
  };

  const handleEdit = (id: string) => {
    setMessageDialog({ open: true, id });
  };

  const handleDelete = (id: string) => {
    setDeleteDialog({ open: true, id });
  };

  return (
    <>
      <Box
        ref={divRef}
        sx={{
          height: '100%',
          bgcolor: '#000',
          position: 'relative',
          '> .swiper': {
            width: '100%',
            height: '100%',
          },
        }}
      >
        <Swiper onSlideChange={handleSlideChange}>
          {boards.map((board, index) => (
            <SwiperSlide key={index}>
              <CandlesSlide
                board={board}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>

      {me ? (
        <IconButton
          onClick={() => setMessageDialog({ open: true })}
          size="large"
          sx={{
            position: 'fixed',
            zIndex: 10,
            bgcolor: (theme) => theme.palette.primary.main,
            bottom: (theme) => theme.spacing(2),
            right: (theme) => theme.spacing(2),
            color: (theme) => theme.palette.primary.contrastText,
          }}
        >
          <AddIcon />
        </IconButton>
      ) : null}

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
        title={`화살기도${messageDialog?.id ? ' 수정' : ''}`}
        onClose={() => setMessageDialog(null)}
        onSubmit={(message) => {
          if (messageDialog?.id) {
            editCandle(message);
          } else {
            addCandle(message);
          }
        }}
      />
    </>
  );
};

export default Candles;
