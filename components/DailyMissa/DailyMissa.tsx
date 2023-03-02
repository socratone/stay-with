import Box from '@mui/material/Box';

const DailyMissa = () => {
  return (
    <Box
      component="iframe"
      src="https://missa.cbck.or.kr/DailyMissa"
      sx={{
        border: 0,
        width: '100%',
        height: { xs: '50vh', sm: '50vh', md: '100%' },
        display: 'block',
      }}
    />
  );
};

export default DailyMissa;
