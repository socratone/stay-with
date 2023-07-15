import { enqueueSnackbar } from 'notistack';

type CopyToClipboardOptions = {
  targetName?: string;
};

export const copyToClipboard = async (
  text: string,
  options?: CopyToClipboardOptions
) => {
  try {
    await window.navigator.clipboard.writeText(text);
    if (options?.targetName) {
      enqueueSnackbar(`${options.targetName}를 클립보드에 복사했어요 😆`);
    } else {
      enqueueSnackbar('클립보드에 복사했어요 😆');
    }
  } catch {
    enqueueSnackbar('지원하지 않는 장치인가 봐요. 복사가 안 되네요? 😨');
  }
};
