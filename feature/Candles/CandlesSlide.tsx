import 'swiper/css';

import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import AlertDialog from 'components/AlertDialog/AlertDialog';
import ErrorMessage from 'components/ErrorMessage/ErrorMessage';
import { deleteArrow, postArrow, putArrow } from 'helpers/axios';
import useArrows from 'hooks/api/useArrows';
import useAuth from 'hooks/auth/useAuth';
import cloneDeep from 'lodash/cloneDeep';
import { useEffect, useRef, useState } from 'react';
import {
  assignValue,
  assignValues,
  createEmptyBoard,
  parseBoardToArrayWithCoordinate,
} from 'utils/board';

import CandleItem, { CANDLE_HEIGHT } from './CandleItem';
import { getRandomCandleImageSrc } from './helpers';
import { useCandlesRowColumnCount } from './hooks';
import MessageDialog from './MessageDialog';
import { Candle } from './types';

type CandlesSlideProps = {
  index: number;
  maxCount?: number;
  enabled: boolean;
};

type Dialog = {
  id?: string;
  open: boolean;
};

const ROW_OFFSET = 0.5 * CANDLE_HEIGHT;

const CandlesSlide: React.FC<CandlesSlideProps> = ({
  index,
  maxCount,
  enabled,
}) => {
  const { user: me } = useAuth();

  const divRef = useRef<HTMLDivElement>(null);
  const page = index + 1;

  const [messageDialog, setMessageDialog] = useState<Dialog | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<Dialog | null>(null);
  const [selectedArrowId, setSelectedArrowId] = useState<string | null>(null);

  const [board, setBoard] = useState<(Candle | null)[][]>([]);

  const {
    data: arrowsData,
    isLoading: arrowsLoading,
    isError: arrowsError,
  } = useArrows(
    {
      skip: (maxCount ?? 0) * (page - 1),
      limit: maxCount ?? 0,
    },
    {
      enabled: enabled && !!maxCount,
    }
  );

  const candles = arrowsData ? parseBoardToArrayWithCoordinate(board) : [];

  const { rowCount, columnCount } = useCandlesRowColumnCount({ ref: divRef });

  // arrowsData 또는 화면 크기가 달라지면 board를 새로 생성한다.
  useEffect(() => {
    if (arrowsData && rowCount && columnCount) {
      // data를 받아서 board에 넣는다.
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
    setSelectedArrowId(null);
  };

  const handleDelete = (id: string) => {
    setDeleteDialog({ open: true, id });
    setSelectedArrowId(null);
  };

  const handleTooltipOpenChange = (open: boolean, id: string) => {
    if (open) setSelectedArrowId(id);
    else setSelectedArrowId(null);
  };

  return (
    <>
      <Box
        ref={divRef}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          width: '100%',
          height: '100%',
        }}
      >
        {arrowsLoading ? (
          <CircularProgress />
        ) : arrowsError ? (
          <ErrorMessage />
        ) : (
          candles.map((candle, index) => (
            <CandleItem
              key={candle._id}
              row={candle.row}
              column={candle.column}
              rowOffset={candle.column % 2 === 0 ? ROW_OFFSET : undefined}
              imageSrc={getRandomCandleImageSrc(index)}
              message={candle.message}
              name={candle.user?.name}
              profileUrl={candle.user?.imageUrl}
              createdAt={candle.createdAt}
              isMyself={candle.userId === me?._id}
              onEdit={() => handleEdit(candle._id)}
              onDelete={() => handleDelete(candle._id)}
              tooltipOpen={selectedArrowId === candle._id}
              onTooltipOpenChange={(open) =>
                handleTooltipOpenChange(open, candle._id)
              }
            />
          ))
        )}
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

export default CandlesSlide;
