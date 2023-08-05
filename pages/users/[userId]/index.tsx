import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import ErrorMessage from 'components/ErrorMessage';
import FloatingButton from 'components/FloatingButton';
import LoadingCircular from 'components/LoadingCircular';
import LexioDivinas from 'feature/lexio-divina/LexioDivinas';
import LexioDivinasPagination from 'feature/lexio-divina/LexioDivinasPagination';
import UserInfo from 'feature/lexio-divina/UserInfo';
import useUser from 'hooks/api/useUser';
import useAuth from 'hooks/auth/useAuth';
import useScrollDirection from 'hooks/dom/useScrollDirection';
import useScrollRestoration from 'hooks/dom/useScrollRestoration';
import useIsBreakpointsDown from 'hooks/theme/useIsBreakpointsDown';
import { useRouter } from 'next/router';
import { useState } from 'react';

const ITEM_COUNT_PER_PAGE = 40;

const UserId = () => {
  const router = useRouter();

  const { user } = useAuth();
  const isLoggedIn = !!user;
  const { scrollDirection } = useScrollDirection();
  const userId =
    typeof router.query.userId === 'string' ? router.query.userId : undefined;
  const { data: userData, isLoading, isError } = useUser(userId);

  const isSmall = useIsBreakpointsDown('sm');
  useScrollRestoration();

  const [page, setPage] = useState(1);

  const handlePageChange = (page: number) => {
    window.scrollTo({ top: 0 });
    setPage(page);
  };

  if (isLoading) {
    return (
      <Box p={2}>
        <LoadingCircular />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box p={2}>
        <ErrorMessage />
      </Box>
    );
  }

  const handleAdd = () => {
    router.push('/lexio-divinas/create');
  };

  return (
    <>
      <UserInfo userId={userData?.user._id} />

      <LexioDivinas
        page={page}
        countPerPage={ITEM_COUNT_PER_PAGE}
        filter={{
          userId: userData?.user._id,
        }}
      />

      {!isSmall ? (
        <LexioDivinasPagination
          page={page}
          onChange={handlePageChange}
          countPerPage={ITEM_COUNT_PER_PAGE}
          filter={{
            userId: userData?.user._id,
          }}
        />
      ) : null}

      {isLoggedIn ? (
        <FloatingButton
          icon={<AddIcon />}
          hidden={scrollDirection === 'down'}
          onClick={handleAdd}
        />
      ) : null}
    </>
  );
};

export default UserId;
