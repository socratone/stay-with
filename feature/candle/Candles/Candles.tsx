import 'swiper/css';

import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import AlertDialog from 'components/AlertDialog/AlertDialog';
import FloatingButton from 'components/FloatingButton/FloatingButton';
import { deleteArrow, postArrow, putArrow } from 'helpers/axios';
import useArrows from 'hooks/api/useArrows';
import useAuth from 'hooks/auth/useAuth';
import cloneDeep from 'lodash/cloneDeep';
import { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { Swiper, SwiperSlide } from 'swiper/react';
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
  const { formatMessage } = useIntl();
  const { user: me } = useAuth();

  const divRef = useRef<HTMLDivElement>(null);

  const [board, setBoard] = useState<(Candle | null)[][]>([]);

  const [messageDialog, setMessageDialog] = useState<Dialog | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<Dialog | null>(null);

  const { rowCount, columnCount } = useCandlesRowColumnCount({ ref: divRef });
  const maxCandleCount =
    rowCount && columnCount
      ? Math.round(columnCount * rowCount * 0.4)
      : undefined;

  const { data: arrowsData } = useArrows(
    {
      skip: 0,
      limit: maxCandleCount as number,
    },
    { enabled: !!maxCandleCount }
  );

  // arrowsData 또는 화면 크기가 달라지면 board를 새로 생성한다.
  useEffect(() => {
    if (arrowsData && rowCount && columnCount) {
      const board = createEmptyBoard(rowCount, columnCount);
      assignValues(board, arrowsData.arrows);
      setBoard(board);
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

  const addCandle = async (message: string) => {
    if (!me || message.length === 0) return;
    setMessageDialog(null);
    const trimedMessage = message.trim();

    try {
      const result = await postArrow({
        message: trimedMessage,
        userId: me._id,
      });
      // TODO: refetch for history view
      setBoard((board) => {
        const newBoard = cloneDeep(board);
        assignValue(newBoard, {
          _id: String(result.insertedId),
          message: trimedMessage,
          user: me,
          userId: me._id,
          createdAt: new Date(),
        });
        return newBoard;
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
      // TODO: refetch for history view
      setBoard((board) => {
        const newBoard = cloneDeep(board);
        changeCandleMessage(newBoard, arrowId, trimedMessage);
        return newBoard;
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
      // TODO: refetch for history view
      setBoard((board) => {
        const newBoard = cloneDeep(board);
        changeCandle(newBoard, arrowId, null);
        return newBoard;
      });
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
        <Swiper
        // TODO: ArrowHistories의 page와 sync 되도록 수정
        // onSlideChange={handleSlideChange}
        >
          <SwiperSlide>
            <CandlesSlide
              board={board}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </SwiperSlide>
        </Swiper>
      </Box>

      {me ? (
        <FloatingButton
          icon={<AddIcon />}
          onClick={() => setMessageDialog({ open: true })}
        />
      ) : null}

      <AlertDialog
        open={!!deleteDialog}
        title={formatMessage({ id: 'alert.delete.title' })}
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
