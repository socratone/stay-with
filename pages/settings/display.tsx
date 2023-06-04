import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ImageToggleButtonGroup from 'components/ImageToggleButtonGroup/ImageToggleButtonGroup';
import SettingsLayout from 'feature/SettingsLayout/SettingsLayout';
import useFontSize from 'hooks/theme/useFontSize';

const SettingsDisplay = () => {
  const { fontSize, changeFontSize } = useFontSize();

  const handleFontSizeChange = (fontSize: string) => {
    changeFontSize(fontSize);
  };

  return (
    <SettingsLayout>
      <Box py={1.5}>
        <Stack spacing={1.5}>
          <Box>
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
                  value: '28px',
                },
                {
                  image: {
                    src: 'https://picsum.photos/id/1/200/303',
                    alt: 'alt',
                    width: 100,
                    height: 100,
                  },
                  value: '24px',
                },
                {
                  image: {
                    src: 'https://picsum.photos/id/1/200/300',
                    alt: 'alt',
                    width: 100,
                    height: 100,
                  },
                  value: '20px',
                },
                {
                  image: {
                    src: 'https://picsum.photos/id/1/200/300',
                    alt: 'alt',
                    width: 100,
                    height: 100,
                  },
                  value: '16px',
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
