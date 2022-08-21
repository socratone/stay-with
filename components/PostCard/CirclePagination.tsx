import { Box, useTheme } from '@mui/material';

interface CirclePaginationProps {
  page: number;
  length: number;
}

const CirclePagination: React.FC<CirclePaginationProps> = ({
  page,
  length,
}) => {
  const theme = useTheme();

  const getCircles = () => {
    const circles = [];

    for (let i = 1; i <= length; i++) {
      circles.push('');
    }

    return circles;
  };

  if (length === 1) {
    return null;
  }

  return (
    <Box display="flex" alignItems="center" gap={0.5}>
      {getCircles().map((_, index) => (
        <Box
          key={index}
          bgcolor={index === page ? 'primary.main' : 'grey.300'}
          borderRadius="50%"
          width={theme.spacing(1)}
          height={theme.spacing(1)}
        />
      ))}
    </Box>
  );
};

export default CirclePagination;
