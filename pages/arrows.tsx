import Box from '@mui/material/Box';
import GlobalHeader from 'components/GlobalHeader/GlobalHeader';
import Meta from 'components/Meta/Meta';
import Candles from 'feature/Candles';

const Arrows = () => {
  return (
    <Box height="100%" display="flex" flexDirection="column">
      <Meta />
      <GlobalHeader dark />
      <Candles />
    </Box>
  );
};

export default Arrows;
