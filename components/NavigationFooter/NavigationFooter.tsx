import { BottomNavigation, BottomNavigationAction, Box } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import PublicIcon from '@mui/icons-material/Public';
import ChurchIcon from '@mui/icons-material/Church';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

const NavigationFooter = () => {
  const router = useRouter();

  const [value, setValue] = useState(() => {
    switch (router.pathname) {
      case '/':
        return 0;
      case '/public':
        return 1;
      default:
        return 0;
    }
  });

  const [height, setHeight] = useState(0);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;

    if (element) {
      setHeight(element.offsetHeight);
    }
  }, []);

  return (
    <>
      {/* bumper */}
      <Box height={height} />

      <Box
        ref={ref}
        position="fixed"
        width="100vw"
        bottom={0}
        zIndex={1}
        borderTop={1}
        borderColor="grey.200"
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction
            onClick={() => router.push('/')}
            icon={<HomeIcon />}
            disableRipple
          />
          <BottomNavigationAction
            onClick={() => router.push('/public')}
            icon={<PublicIcon />}
            disableRipple
          />
          <BottomNavigationAction
            onClick={() => router.push('/create')}
            icon={<AddIcon />}
            disableRipple
          />
          <BottomNavigationAction
            onClick={() => router.push('/')}
            icon={<SearchIcon />}
            disableRipple
          />
          <BottomNavigationAction
            onClick={() => router.push('/')}
            icon={<ChurchIcon />}
            disableRipple
          />
        </BottomNavigation>
      </Box>
    </>
  );
};

export default NavigationFooter;
