import Script from 'next/script';
import { enqueueSnackbar } from 'notistack';

type KakaoSdkScriptProps = {
  onLoad: () => void;
};

const KakaoSdkScript: React.FC<KakaoSdkScriptProps> = ({ onLoad }) => {
  const handleScriptError = () => {
    enqueueSnackbar('Kakao SDK를 불러오는 중에 에러가 발생했습니다.', {
      variant: 'error',
    });
  };

  return (
    <Script
      src="https://t1.kakaocdn.net/kakao_js_sdk/2.3.0/kakao.min.js"
      integrity="sha384-70k0rrouSYPWJt7q9rSTKpiTfX6USlMYjZUtr1Du+9o4cGvhPAWxngdtVZDdErlh"
      crossOrigin="anonymous"
      onLoad={onLoad}
      onError={handleScriptError}
    />
  );
};

export default KakaoSdkScript;
