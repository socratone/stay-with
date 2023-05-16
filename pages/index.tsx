import GlobalHeader from 'components/GlobalHeader';
import Meta from 'components/Meta';
import SelectorDialog from 'components/SelectorDialog/SelectorDialog';
import { CollectionName } from 'constants/mongodb';
import LexioDivinas from 'feature/LexioDivinas';
import { ITEM_COUNT_PER_PAGE } from 'feature/LexioDivinas/LexioDivinas';
import useTempLexioDivinaStatus from 'hooks/form/useTempLexioDivinaStatus';
import type { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { resetTempLexioDivina } from 'redux/tempLexioDivinaSlice';
import Mongodb from 'utils/mongodb';

import { ApiLexioDivinasData } from './api/lexio-divinas';

type HomeProps = {
  firstPageItems: ApiLexioDivinasData['lexioDivinas'];
};

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const db = new Mongodb();

  // https://stackoverflow.com/questions/69978663/get-data-from-another-collection-string-objectid
  const lexioDivinas = await db.aggregate<ApiLexioDivinasData['lexioDivinas']>(
    CollectionName.LexioDivinas,
    [
      {
        // https://www.mongodb.com/docs/v6.0/reference/operator/aggregation/lookup/#syntax
        $lookup: {
          from: CollectionName.Users,
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $sort: {
          _id: -1,
        },
      },
      {
        $skip: 0,
      },
      {
        $limit: ITEM_COUNT_PER_PAGE,
      },
      {
        $addFields: {
          createdAt: { $toDate: '$_id' },
        },
      },
    ]
  );

  db.close();

  return {
    props: {
      firstPageItems: JSON.parse(JSON.stringify(lexioDivinas)),
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
