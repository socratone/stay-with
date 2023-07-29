import { Stack, Typography } from '@mui/material';
import Container from '@mui/material/Container';
import { GLOBAL_HEADER_HEIGHT } from 'components/GlobalHeader/constants';

const Custom404 = () => {
  return (
    <Container
      sx={{
        height: `calc(100vh - ${GLOBAL_HEADER_HEIGHT})`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Stack>
        <Typography
          color="text.primary"
          textAlign="center"
          variant="h2"
          fontWeight={600}
        >
          404
        </Typography>
        <Typography color="text.primary" textAlign="center">
          페이지를 찾을 수 없어요 😅
        </Typography>
      </Stack>
    </Container>
  );
};

export default Custom404;
