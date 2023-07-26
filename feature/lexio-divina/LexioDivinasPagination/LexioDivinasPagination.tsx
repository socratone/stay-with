import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';
import useLexioDivinasCount from 'hooks/api/useLexioDivinasCount';

type LexioDivinasPaginationProps = {
  page: number;
  onChange: (page: number) => void;
  countPerPage: number;
  filter?: {
    userId?: string;
  };
};

const LexioDivinasPagination: React.FC<LexioDivinasPaginationProps> = ({
  page,
  onChange,
  countPerPage,
  filter,
}) => {
  const { data: lexioDivinasCountData } = useLexioDivinasCount({
    userId: filter?.userId,
  });

  return (
    <Box display="flex" justifyContent="center">
      {(lexioDivinasCountData?.count ?? 0) <= countPerPage ? null : (
        <Pagination
          page={page}
          onChange={(_, page) => onChange(page)}
          count={Math.ceil(Number(lexioDivinasCountData?.count) / countPerPage)}
        />
      )}
    </Box>
  );
};

export default LexioDivinasPagination;
