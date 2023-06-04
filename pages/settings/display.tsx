import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ImageToggleButtonGroup from 'components/ImageToggleButtonGroup/ImageToggleButtonGroup';
import SettingsLayout from 'feature/SettingsLayout/SettingsLayout';
import useFontSize from 'hooks/theme/useFontSize';

const SettingsDisplay = () => {
  const { fontSize, changeFontSize } = useFontSize();

  const handleFontSizeChange = (fontSize: string) => {
    changeFontSize(Number(fontSize));
  };

  return (
    <SettingsLayout>
      <Box py={1.5}>
        <Stack spacing={1.5}>
          <Box component="label">
            <Typography
              color="text.primary"
              component="h2"
              fontWeight={500}
              variant="body1"
              mb={0.5}
            >
              텍스트 크기
            </Typography>
            <ImageToggleButtonGroup
              value={String(fontSize)}
              onChange={handleFontSizeChange}
              options={[
                {
                  image: {
                    src: 'https://picsum.photos/id/1/200/302',
                    alt: 'alt',
                    width: 100,
                    height: 100,
                  },
                  value: '26',
                },
                {
                  image: {
                    src: 'https://picsum.photos/id/1/200/303',
                    alt: 'alt',
                    width: 100,
                    height: 100,
                  },
                  value: '22',
                },
                {
                  image: {
                    src: 'https://picsum.photos/id/1/200/300',
                    alt: 'alt',
                    width: 100,
                    height: 100,
                  },
                  value: '18',
                },
                {
                  image: {
                    src: 'https://picsum.photos/id/1/200/300',
                    alt: 'alt',
                    width: 100,
                    height: 100,
                  },
                  value: '14',
                },
              ]}
            />
          </Box>
        </Stack>
      </Box>
    </SettingsLayout>
  );
};

export default SettingsDisplay;
