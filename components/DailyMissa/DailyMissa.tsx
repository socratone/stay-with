import Box from '@mui/material/Box';

const DailyMissa = () => {
  return (
    <Box
      component="iframe"
      src="https://missa.cbck.or.kr/DailyMissa"
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
