import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import androidFirstImage from 'public/images/android-pwa-download-1.jpeg';
import androidSecondImage from 'public/images/android-pwa-download-2.jpeg';
import iosFirstImage from 'public/images/ios-pwa-download-1.jpg';
import iosSecondImage from 'public/images/ios-pwa-download-2.jpg';

const IMAGE_SIZES = '(max-width: 600px) 100vw, 50vw';

const Downloads = () => {
  return (
    <Container>
      <Stack py={1}>
        <Typography color="text.primary" variant="mh1">
          PWA 앱 설치 방법
        </Typography>
        <Typography color="text.primary" sx={{ whiteSpace: 'pre-line' }}>
          {'PWA 앱으로 설치해서 일반 앱처럼 사용하실 수 있습니다.\n'}
          <Typography component="span" color="text.secondary">
            (💡 아이폰의 경우 staywith.kr 서비스 업데이트 시에 제대로 작동하지
            않는 사례가 있으니 문제 발생시 재설치를 해보세요.)
          </Typography>
        </Typography>
        <Typography color="text.primary" variant="mh2" mt={3}>
          🤖 Android
        </Typography>
        <Typography
          color="text.primary"
          variant="mp"
          sx={{ whiteSpace: 'pre-line' }}
        >
          {
            '안드로이드의 경우 앱 설치 방법입니다.\n크롬 브라우저에서 가능합니다.'
          }
        </Typography>
        <Box
          display="grid"
          gridTemplateColumns={{
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
          }}
          gap={2}
          maxWidth={700}
        >
          <Stack>
            <Typography color="text.primary" variant="mp" fontWeight={600}>
              1. ... 버튼을 누릅니다.
            </Typography>
            <Box
              position="relative"
              border={1}
              borderColor={(theme) => theme.palette.divider}
              sx={{ aspectRatio: '1080 / 2400' }}
            >
              <Image
                alt="안드로이드 PWA 다운로드 1"
                src={androidFirstImage}
                fill
                sizes={IMAGE_SIZES}
              />
            </Box>
          </Stack>
          <Stack>
            <Typography color="text.primary" variant="mp" fontWeight={600}>
              2. 홈 화면에 추가 버튼을 누릅니다. (또는 앱 설치)
            </Typography>
            <Box
              position="relative"
              border={1}
              borderColor={(theme) => theme.palette.divider}
              sx={{ aspectRatio: '1080 / 2400' }}
            >
              <Image
                alt="안드로이드 PWA 다운로드 2"
                src={androidSecondImage}
                fill
                sizes={IMAGE_SIZES}
              />
            </Box>
          </Stack>
        </Box>

        <Typography color="text.primary" variant="mh2" mt={3}>
          🍏 IOS
        </Typography>
        <Typography
          color="text.primary"
          variant="mp"
          sx={{ whiteSpace: 'pre-line' }}
        >
          {'아이폰의 경우 앱 설치 방법입니다.\n사파리 브라우저에서 가능합니다.'}
        </Typography>
        <Box
          display="grid"
          gridTemplateColumns={{
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
          }}
          gap={2}
          maxWidth={700}
        >
          <Stack>
            <Typography color="text.primary" variant="mp" fontWeight={600}>
              1. 공유 버튼을 누릅니다.
            </Typography>
            <Box
              position="relative"
              border={1}
              borderColor={(theme) => theme.palette.divider}
              sx={{ aspectRatio: '1080 / 2400' }}
            >
              <Image
                alt="아이폰 PWA 다운로드 1"
                src={iosFirstImage}
                fill
                sizes={IMAGE_SIZES}
              />
            </Box>
          </Stack>
          <Stack>
            <Typography color="text.primary" variant="mp" fontWeight={600}>
              2. 홈 화면에 추가 버튼을 누릅니다.
            </Typography>
            <Box
              position="relative"
              border={1}
              borderColor={(theme) => theme.palette.divider}
              sx={{ aspectRatio: '1080 / 2400' }}
            >
              <Image
                alt="아이폰 PWA 다운로드 2"
                src={iosSecondImage}
                fill
                sizes={IMAGE_SIZES}
              />
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
};

export default Downloads;
