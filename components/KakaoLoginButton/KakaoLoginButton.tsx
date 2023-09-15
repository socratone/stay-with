import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';

type KakaoLoginButtonProps = {
  disabled?: boolean;
  onClick?: () => void;
};

const KakaoIcon = () => (
  <svg
    width="20"
    height="19"
    viewBox="0 0 20 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 0C11.808 0 13.4803 0.361899 15.0167 1.0857C16.5532 1.8095 17.7679 2.79372 18.6607 4.03835C19.5536 5.28293 20 6.64054 20 8.11114C20 9.58169 19.5536 10.9412 18.6607 12.1897C17.7679 13.4381 16.5551 14.4243 15.0223 15.1481C13.4896 15.8718 11.8155 16.2338 10 16.2338C9.42709 16.2338 8.83555 16.1916 8.22544 16.1074C5.57662 17.9992 4.16668 18.9566 3.99555 18.9796C3.91369 19.0102 3.83555 19.0064 3.76115 18.9681C3.73138 18.9451 3.70907 18.9145 3.69419 18.8762C3.6793 18.8379 3.67188 18.8034 3.67188 18.7728V18.7268C3.71654 18.4281 4.05505 17.1835 4.6875 14.993C3.25149 14.2577 2.11123 13.283 1.26674 12.069C0.422247 10.8551 0 9.53576 0 8.11114C0 6.64054 0.446429 5.28293 1.33929 4.03835C2.23214 2.79372 3.4468 1.8095 4.98326 1.0857C6.51971 0.361899 8.19196 0 10 0Z"
      fill="#1a1a1c"
    />
  </svg>
);

const KakaoLoginButton: React.FC<KakaoLoginButtonProps> = ({
  disabled,
  onClick,
}) => {
  return (
    <ButtonBase
      onClick={onClick}
      disabled={disabled}
      sx={{
        bgcolor: (theme) => theme.palette.kakao.main,
        color: (theme) => theme.palette.kakao.contrastText,
        borderRadius: 2,
        paddingX: 4,
        paddingY: 1.5,
        width: '100%',
        maxWidth: 'sm',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          left: 16,
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <KakaoIcon />
      </Box>
      <Typography fontWeight={500}>카카오 로그인</Typography>
    </ButtonBase>
  );
};

export default KakaoLoginButton;
