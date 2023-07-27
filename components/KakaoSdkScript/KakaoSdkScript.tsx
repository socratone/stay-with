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
      src="https://t1.kakaocdn.net/kakao_js_sdk/2.1.0/kakao.min.js"
      integrity="sha384-dpu02ieKC6NUeKFoGMOKz6102CLEWi9+5RQjWSV0ikYSFFd8M3Wp2reIcquJOemx"
      crossOrigin="anonymous"
      onLoad={onLoad}
      onError={handleScriptError}
    />
  );
};

export default KakaoSdkScript;
