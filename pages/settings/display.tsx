import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextToggleButtonGroup from 'components/TextToggleButtonGroup';
import { FontSize } from 'contexts/ThemeProvider';
import SettingsLayout from 'feature/SettingsLayout';
import useFontSize from 'hooks/theme/useFontSize';

const SettingsDisplay = () => {
  const { fontSize, changeFontSize } = useFontSize();

  const handleFontSizeChange = (fontSize: FontSize) => {
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
            <TextToggleButtonGroup
              value={fontSize}
              onChange={handleFontSizeChange}
              options={[
                {
                  value: '28px',
                  label: '아주 크게',
                },
                {
                  value: '24px',
                  label: '크게',
                },
                {
                  value: '20px',
                  label: '조금 크게',
                },
                {
                  value: '16px',
                  label: '보통',
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
