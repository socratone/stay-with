import 'react-spring-bottom-sheet/dist/style.css';

import useColorMode from 'hooks/context/useColorMode';
import { useEffect } from 'react';
import { BottomSheet, BottomSheetProps } from 'react-spring-bottom-sheet';

interface LexioDivinaBottomSheetProps {
  defaultSnap?: BottomSheetProps['defaultSnap'];
  snapPoints?: BottomSheetProps['snapPoints'];
  children: React.ReactNode;
}

const LexioDivinaBottomSheet: React.FC<LexioDivinaBottomSheetProps> = ({
  defaultSnap = 300,
  snapPoints = ({ maxHeight }) => [
    (maxHeight / 10) * 9,
    (maxHeight / 10) * 8,
    (maxHeight / 10) * 7,
    (maxHeight / 10) * 6,
    (maxHeight / 10) * 5,
    (maxHeight / 10) * 4,
    (maxHeight / 10) * 3,
    300,
    110,
  ],
  children,
}) => {
  const { colorMode } = useColorMode();

  useEffect(() => {
    const root = document.querySelector(':root') as any;
    root.style.setProperty('--rsbs-max-w', '600px');
    root.style.setProperty('--rsbs-ml', 'auto');
    root.style.setProperty('--rsbs-mr', 'auto');

    if (colorMode === 'dark') {
      root.style.setProperty('--rsbs-bg', 'black');
      root.style.setProperty('--rsbs-handle-bg', 'white');
    } else {
      root.style.setProperty('--rsbs-bg', '');
      root.style.setProperty('--rsbs-handle-bg', '');
    }
  }, [colorMode]);

  return (
    <BottomSheet
      open
      defaultSnap={defaultSnap}
      snapPoints={snapPoints}
      expandOnContentDrag
      blocking={false}
    >
      {children}
    </BottomSheet>
  );
};

export default LexioDivinaBottomSheet;
