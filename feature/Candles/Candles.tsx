import 'swiper/css';

import Box from '@mui/material/Box';
import { useQueryClient } from '@tanstack/react-query';
import AlertDialog from 'components/AlertDialog/AlertDialog';
import { deleteArrow, putArrow } from 'helpers/axios';
import { ARROW_QUERY_KEY } from 'hooks/api/useArrow';
import { ARROWS_QUERY_KEY } from 'hooks/api/useArrows';
import useArrowsCount, {
  ARROWS_COUNT_QUERY_KEY,
} from 'hooks/api/useArrowsCount';
import range from 'lodash/range';
import { enqueueSnackbar } from 'notistack';
import { memo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';

import CandlesSlide from './CandlesSlide';
import EditDialog from './EditDialog';
import { Candle } from './types';
import useCandlesRowColumnCount from './useCandlesRowColumnCount';

type CandlesProps = {
  additionalCandles: Candle[];
};

type Dialog = {
  id: string;
};

const Candles: React.FC<CandlesProps> = ({ additionalCandles }) => {
  const queryClient = useQueryClient();
  const { formatMessage } = useIntl();

  const divRef = useRef<HTMLDivElement>(null);

  const [page, setPage] = useState(1);

  const [editDialog, setEditDialog] = useState<Dialog | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<Dialog | null>(null);
  const [selectedArrowId, setSelectedArrowId] = useState<string | null>(null);

  const { data: arrowsCountData } = useArrowsCount();

  const { rowCount, columnCount } = useCandlesRowColumnCount({ ref: divRef });
  const maxCandleCount =
    rowCount && columnCount
      ? Math.round(columnCount * rowCount * 0.4)
      : undefined;

  const paginationCount =
    arrowsCountData && maxCandleCount
      ? Math.ceil(arrowsCountData.count / maxCandleCount)
      : 0;

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

  const handleSlideChange = (swiper: SwiperClass) => {
    setPage(swiper.activeIndex + 1);
  };

  const handleEdit = (id: string) => {
    setEditDialog({ id });
    setSelectedArrowId(null);
  };

  const handleDelete = (id: string) => {
    setDeleteDialog({ id });
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
        flexGrow={1}
        sx={{
          bgcolor: '#000',
          position: 'relative',
          '> .swiper': {
            width: '100%',
            height: '100%',
          },
        }}
      >
        <Swiper onSlideChange={handleSlideChange}>
          {range(paginationCount).map((_, index) => (
            <SwiperSlide key={index}>
              <CandlesSlide
                additionalCandles={index === 0 ? additionalCandles : undefined}
                index={index}
                maxCount={maxCandleCount}
                enabled={page >= index}
                selectedArrowId={selectedArrowId}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onTooltipOpenChange={handleTooltipOpenChange}
              />
            </SwiperSlide>
          ))}
        </Swiper>
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

export default memo(Candles);
