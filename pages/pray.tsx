import { Box, Container } from '@mui/material';
import GlobalFooter from '../components/GlobalFooter';
import GlobalHeader from '../components/GlobalHeader';
import useScrollDirection from '../hooks/dom/useScrollDirection';

const Pray = () => {
  const { scrollDirection } = useScrollDirection();

  return (
    <>
      <GlobalHeader />

      <Container
        component="main"
        maxWidth="sm"
        sx={{ px: { xs: 0, sm: 0, md: 0 } }}
      >
        <Box
          sx={{
            aspectRatio: '1920 / 1080',
          }}
        >
          <iframe
            width="100%"
            height="100%"
            id="ytplayer"
            src="https://www.youtube.com/embed/f742p7mQ0Ic?autoplay=1"
            frameBorder="0"
          />
        </Box>
      </Container>

      <GlobalFooter hidden={scrollDirection === 'down'} />
    </>
  );
};

export default Pray;
