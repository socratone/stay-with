import 'swiper/css';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useQueryClient } from '@tanstack/react-query';
import AlertDialog from 'components/AlertDialog/AlertDialog';
import ErrorMessage from 'components/ErrorMessage/ErrorMessage';
import { deleteArrow, putArrow } from 'helpers/axios';
import { ARROW_QUERY_KEY } from 'hooks/api/useArrow';
import useArrows, { ARROWS_QUERY_KEY } from 'hooks/api/useArrows';
import { ARROWS_COUNT_QUERY_KEY } from 'hooks/api/useArrowsCount';
import useAuth from 'hooks/auth/useAuth';
import cloneDeep from 'lodash/cloneDeep';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import {
  assignValue,
  assignValues,
  createEmptyBoard,
  parseBoardToArrayWithCoordinate,
} from 'utils/board';

import CandleItem, { CANDLE_HEIGHT } from './CandleItem';
import EditDialog from './EditDialog';
import { getRandomCandleImageSrc } from './helpers';
import { Candle } from './types';
import useCandlesRowColumnCount from './useCandlesRowColumnCount';

type CandlesSlideProps = {
  additionalCandles?: Candle[];
  index: number;
  maxCount?: number;
  enabled: boolean;
};

type Dialog = {
  id: string;
};

const ROW_OFFSET = 0.5 * CANDLE_HEIGHT;

const CandlesSlide: React.FC<CandlesSlideProps> = ({
  additionalCandles = [],
  index,
  maxCount,
  enabled,
}) => {
  const queryClient = useQueryClient();
  const { formatMessage } = useIntl();
  const { user: me } = useAuth();
  const divRef = useRef<HTMLDivElement>(null);
  const page = index + 1;

  const [editDialog, setEditDialog] = useState<Dialog | null>(null);
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

  useEffect(() => {
    if (arrowsData && rowCount && columnCount) {
      // data를 받아서 board에 넣는다.
      const board = createEmptyBoard(rowCount, columnCount);
      assignValues(board, arrowsData.arrows);
      setBoard(board);
    }
  }, [rowCount, columnCount, arrowsData]);

  // message를 입력하여 candle이 추가되면 board에 넣는다.
  useEffect(() => {
    if (additionalCandles.length > 0) {
      const newAdditionalCandle =
        additionalCandles[additionalCandles.length - 1];

      setBoard((board) => {
        const newBoard = cloneDeep(board);
        assignValue(newBoard, newAdditionalCandle);
        return newBoard;
      });
    }
  }, [additionalCandles]);

  const editCandle = async (message: string) => {
    if (!editDialog) return;

    const arrowId = editDialog.id;
    setEditDialog(null);

    try {
      await putArrow(arrowId, {
        message,
      });
      queryClient.invalidateQueries({ queryKey: [ARROWS_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [ARROW_QUERY_KEY, arrowId],
      });
    } catch (error) {
      enqueueSnackbar(formatMessage({ id: 'error.message.common' }), {
        variant: 'error',
      });
    }
  };

  const deleteCandle = async () => {
    if (!deleteDialog) return;

    const arrowId = deleteDialog.id;
    setDeleteDialog(null);

    try {
      await deleteArrow(arrowId);
      queryClient.invalidateQueries({ queryKey: [ARROWS_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [ARROWS_COUNT_QUERY_KEY],
      });
    } catch (error) {
      enqueueSnackbar(formatMessage({ id: 'error.message.common' }), {
        variant: 'error',
      });
    }
  };

  const handleEdit = (id?: string) => {
    if (!id) return;
    setEditDialog({ id });
    setSelectedArrowId(null);
  };

  const handleDelete = (id?: string) => {
    if (!id) return;
    setDeleteDialog({ id });
    setSelectedArrowId(null);
  };

  const handleTooltipOpenChange = (open: boolean, id?: string) => {
    if (!id) return;
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

      <AlertDialog
        open={!!deleteDialog}
        title="삭제 확인"
        description="기도를 삭제하시겠습니까?"
        onClose={() => setDeleteDialog(null)}
        onSubmit={deleteCandle}
        color="error"
      />

      <EditDialog
        id={editDialog?.id}
        open={!!editDialog}
        title="화살기도 수정"
        onClose={() => setEditDialog(null)}
        onSubmit={editCandle}
      />
    </>
  );
};

export default CandlesSlide;
