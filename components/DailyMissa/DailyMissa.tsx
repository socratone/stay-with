import Box from '@mui/material/Box';

const DailyMissa = () => {
  return (
    <Box
      component="iframe"
      src="https://m.mariasarang.net/page/missa.asp"
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
