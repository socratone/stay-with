import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FloatingButton from 'components/FloatingButton/FloatingButton';
import SelectorDialog from 'components/SelectorDialog/SelectorDialog';
import LexioDivinas from 'feature/lexio-divina/LexioDivinas';
import LexioDivinasPagination from 'feature/lexio-divina/LexioDivinasPagination';
import { motion } from 'framer-motion';
import useAuth from 'hooks/auth/useAuth';
import useScrollDirection from 'hooks/dom/useScrollDirection';
import useScrollRestoration from 'hooks/dom/useScrollRestoration';
import useTempLexioDivinaStatus from 'hooks/form/useTempLexioDivinaStatus';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { resetTempLexioDivina } from 'redux/tempLexioDivinaSlice';
import { popUp } from 'utils/animation';

const ITEM_COUNT_PER_PAGE = 20;

const Home: NextPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { user } = useAuth();
  const isLoggedIn = !!user;
  const { status, id } = useTempLexioDivinaStatus();
  const { scrollDirection } = useScrollDirection();
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
      {page === 1 ? (
        <Box
          component={motion.div}
          {...popUp()}
          maxWidth="xl"
          sx={{
            px: 2,
            mx: 'auto',
            mt: 2,
          }}
        >
          <Link href="/blogs/lexio-divina">
            <Button disableRipple variant="outlined" size="small">
              렉시오 디비나 기도 방법
            </Button>
          </Link>
        </Box>
      ) : null}
      <LexioDivinas page={page} countPerPage={ITEM_COUNT_PER_PAGE} />
      <LexioDivinasPagination
        page={page}
        onChange={handlePageChange}
        countPerPage={ITEM_COUNT_PER_PAGE}
      />
      {isLoggedIn ? (
        <FloatingButton
          icon={<AddIcon />}
          hidden={scrollDirection === 'down'}
          onClick={handleAdd}
        />
      ) : null}
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
