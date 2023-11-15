import AddIcon from '@mui/icons-material/Add';
import FloatingButton from 'components/FloatingButton/FloatingButton';
import SelectorDialog from 'components/SelectorDialog/SelectorDialog';
import LexioDivinas from 'feature/lexio-divina/LexioDivinas';
import LexioDivinasPagination from 'feature/lexio-divina/LexioDivinasPagination';
import useScrollDirection from 'hooks/dom/useScrollDirection';
import useScrollRestoration from 'hooks/dom/useScrollRestoration';
import useTempLexioDivinaStatus from 'hooks/form/useTempLexioDivinaStatus';
import useIsBreakpointsDown from 'hooks/theme/useIsBreakpointsDown';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { resetTempLexioDivina } from 'redux/tempLexioDivinaSlice';

const ITEM_COUNT_PER_PAGE = 40;

const Home: NextPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { status, id } = useTempLexioDivinaStatus();
  const { scrollDirection } = useScrollDirection();
  const isSmall = useIsBreakpointsDown('sm');
  useScrollRestoration();

  const [page, setPage] = useState(1);
  const [navDialogOpen, setNavDialogOpen] = useState(false);

  useEffect(() => {
    if (status !== 'none') {
      setNavDialogOpen(true);
    }
  }, [status]);

  const handleClose = () => {
    setNavDialogOpen(false);
  };

  const handleRemove = () => {
    dispatch(resetTempLexioDivina());
    setNavDialogOpen(false);
  };

  const handleMove = () => {
    if (id) router.push(`/lexio-divinas/${id}/edit?temp=true`);
    else router.push('/lexio-divinas/create?temp=true');
    setNavDialogOpen(false);
  };

  const handleAdd = () => {
    router.push('/lexio-divinas/create');
  };

  const handlePageChange = (page: number) => {
    window.scrollTo({ top: 0 });
    setPage(page);
  };

  return (
    <>
      <LexioDivinas page={page} countPerPage={ITEM_COUNT_PER_PAGE} />

      {!isSmall ? (
        <LexioDivinasPagination
          page={page}
          onChange={handlePageChange}
          countPerPage={ITEM_COUNT_PER_PAGE}
        />
      ) : null}

      <FloatingButton
        icon={<AddIcon aria-label="New lexio divina" />}
        hidden={scrollDirection === 'down'}
        onClick={handleAdd}
      />

      <SelectorDialog
        title="임시 저장글 확인"
        description="😱 아직 저장하지 않은 글이 있습니다. 저장하러 이동하시겠습니까? 지우기를 눌러 지울 수도 있습니다."
        open={navDialogOpen}
        buttons={[
          {
            label: '지우기',
            onClick: handleRemove,
            variant: 'outlined',
          },
          {
            label: '이동',
            onClick: handleMove,
          },
        ]}
        onClose={handleClose}
      />
    </>
  );
};

export default Home;
