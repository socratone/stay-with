import 'react-spring-bottom-sheet/dist/style.css';

import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import { ColorMode } from 'contexts/ThemeProvider';
import useColorMode from 'hooks/theme/useColorMode';
import { useEffect, useRef, useState } from 'react';
import {
  BottomSheet,
  BottomSheetProps,
  BottomSheetRef,
} from 'react-spring-bottom-sheet';

type LexioDivinaBottomSheetProps = {
  defaultSnap?: BottomSheetProps['defaultSnap'];
  snapPoints?: BottomSheetProps['snapPoints'];
  children: React.ReactNode;
};

const LexioDivinaBottomSheet: React.FC<LexioDivinaBottomSheetProps> = ({
  defaultSnap = 20,
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
    20,
  ],
  children,
}) => {
  const { colorMode } = useColorMode();
  const sheetRef = useRef<BottomSheetRef>(null);

  const [touched, setTouched] = useState(false);

  useEffect(() => {
    const root = document.querySelector(':root') as any;
    root.style.setProperty('--rsbs-max-w', '600px');
    root.style.setProperty('--rsbs-ml', 'auto');
    root.style.setProperty('--rsbs-mr', 'auto');

    if (colorMode === ColorMode.Dark) {
      root.style.setProperty('--rsbs-bg', '#121212');
      root.style.setProperty('--rsbs-handle-bg', '#fff');
    } else {
      root.style.setProperty('--rsbs-bg', '');
      root.style.setProperty('--rsbs-handle-bg', '');
    }
  }, [colorMode]);

  const handleEditIconClick = () => {
    if (sheetRef.current) {
      sheetRef.current.snapTo(300);
      setTouched(true);
    }
  };

  const handleTouch = () => {
    setTouched(true);
  };

  return (
    <BottomSheet
      ref={sheetRef}
      open
      defaultSnap={defaultSnap}
      snapPoints={snapPoints}
      expandOnContentDrag
      blocking={false}
      onTouchStart={handleTouch}
      onMouseDown={handleTouch}
    >
      {children}
      <IconButton
        onTouchStart={handleEditIconClick}
        onMouseDown={handleEditIconClick}
        size="large"
        sx={{
          position: 'absolute',
          bgcolor: (theme) => theme.palette.primary.main,
          bottom: '100%',

          right: (theme) => theme.spacing(2),
          color: (theme) => theme.palette.primary.contrastText,
          transform: (theme) =>
            `translateY(${theme.spacing(touched ? 6 : -2)}) scale(${
              touched ? 0 : 1
            })`,
          opacity: touched ? 0 : 1,
          transition: 'all .3s ease',
          boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
        }}
      >
        <EditIcon />
      </IconButton>
    </BottomSheet>
  );
};

export default LexioDivinaBottomSheet;
