import AddIcon from '@mui/icons-material/Add';
import FloatingButton from 'components/FloatingButton/FloatingButton';
import GlobalHeader from 'components/GlobalHeader';
import Meta from 'components/Meta';
import SelectorDialog from 'components/SelectorDialog/SelectorDialog';
import LexioDivinas from 'feature/LexioDivinas';
import useAuth from 'hooks/auth/useAuth';
import useScrollDirection from 'hooks/dom/useScrollDirection';
import useTempLexioDivinaStatus from 'hooks/form/useTempLexioDivinaStatus';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { resetTempLexioDivina } from 'redux/tempLexioDivinaSlice';

const Home: NextPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { user: isLoggedIn } = useAuth();
  const { status, id } = useTempLexioDivinaStatus();
  const { scrollDirection } = useScrollDirection();

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

  return (
    <>
      <Meta />
      <GlobalHeader />
      <LexioDivinas />
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
