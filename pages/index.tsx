import GlobalHeader from 'components/GlobalHeader';
import Meta from 'components/Meta';
import SelectorDialog from 'components/SelectorDialog/SelectorDialog';
import LexioDivinas from 'feature/LexioDivinas';
import { ITEM_COUNT_PER_PAGE } from 'feature/LexioDivinas/LexioDivinas';
import { getLexioDivinas } from 'helpers/axios';
import useTempLexioDivinaStatus from 'hooks/form/useTempLexioDivinaStatus';
import type { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { resetTempLexioDivina } from 'redux/tempLexioDivinaSlice';

import { ApiLexioDivinasData } from './api/lexio-divinas';

type HomeProps = {
  firstPageItems: ApiLexioDivinasData['lexioDivinas'];
};

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const { lexioDivinas } = await getLexioDivinas({
    limit: ITEM_COUNT_PER_PAGE,
    skip: 0,
  });

  return {
    props: {
      firstPageItems: lexioDivinas,
    },
    revalidate: 10,
  };
};

const Home: NextPage<HomeProps> = ({ firstPageItems }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { status, id } = useTempLexioDivinaStatus();

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

  return (
    <>
      <Meta />
      <GlobalHeader />
      <LexioDivinas firstPageItems={firstPageItems} />
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
