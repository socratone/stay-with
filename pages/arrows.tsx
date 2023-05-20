import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import GlobalHeader from 'components/GlobalHeader/GlobalHeader';
import Meta from 'components/Meta/Meta';
import DarkThemeProvider from 'contexts/DarkThemeProvider';
import Candles from 'feature/Candles';
import { Candle } from 'feature/Candles/types';
import { postArrow } from 'helpers/axios';
import useAuth from 'hooks/auth/useAuth';
import { useRouter } from 'next/router';
import { enqueueSnackbar } from 'notistack';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { createUniqueId } from 'utils/id';

const Arrows = () => {
  const { formatMessage } = useIntl();
  const router = useRouter();

  const { user, logout } = useAuth();

  const [message, setMessage] = useState('');
  const [additionalCandles, setAdditionalCandles] = useState<Candle[]>([]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  const handleSubmit = async () => {
    if (!user || message.length === 0) return;

    const requestedMessage = message;
    setMessage('');

    try {
      await postArrow({
        message: requestedMessage,
        userId: user._id,
      });
      setAdditionalCandles((candles) => [
        ...candles,
        { _id: createUniqueId(), message: requestedMessage },
      ]);
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 401) {
        logout();
        router.push('/expired');
      } else {
        enqueueSnackbar(formatMessage({ id: 'error.message.common' }), {
          variant: 'error',
        });
      }
    }
  };

  return (
    <DarkThemeProvider>
      <Box height="100vh" display="flex" flexDirection="column">
        <Meta />
        <GlobalHeader dark />
        <Candles additionalCandles={additionalCandles} />
        {user ? (
          <Stack
            direction="row"
            p={1}
            position="relative"
            justifyContent="center"
            sx={{ bgcolor: 'black' }}
          >
            <TextField
              value={message}
              onChange={handleChange}
              size="small"
              fullWidth
              multiline
              sx={{
                maxWidth: 300,
              }}
            />
            <Button
              size="small"
              disabled={message.length === 0}
              onClick={handleSubmit}
            >
              저장
            </Button>
          </Stack>
        ) : null}
      </Box>
    </DarkThemeProvider>
  );
};

export default Arrows;
