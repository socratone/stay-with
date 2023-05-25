import Box from '@mui/material/Box';
import useColorMode from 'hooks/theme/useColorMode';

const DailyMissa = () => {
  const { colorMode } = useColorMode();

  if (!colorMode) return null;

  return (
    <Box
      component="iframe"
      src={`/api/missa?mode=${colorMode}`}
      sx={{
        border: 0,
        width: '100%',
        height: '100%',
        display: 'block',
      }}
    />
  );
};

export default DailyMissa;
