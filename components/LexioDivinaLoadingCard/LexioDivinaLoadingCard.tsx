import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import range from 'lodash/range';

type LexioDivinaLoadingCardProps = {
  lineCount: number;
};

const LexioDivinaLoadingCard: React.FC<LexioDivinaLoadingCardProps> = ({
  lineCount,
}) => {
  return (
    <Box
      sx={{
        p: 2,
      }}
    >
      {range(lineCount).map((number) => (
        <Skeleton key={number} variant="text" sx={{ fontSize: '1rem' }} />
      ))}
    </Box>
  );
};

export default LexioDivinaLoadingCard;
