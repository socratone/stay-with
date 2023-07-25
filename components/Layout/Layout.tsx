import GlobalHeader from 'components/GlobalHeader';
import Meta from 'components/Meta';
import VideoPlayer from 'components/VideoPlayer';
import { useRouter } from 'next/router';

import {
  DARK_HEADER_PATHNAMES,
  HEADER_BACK_BUTTON_PATHNAMES,
} from './constants';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();

  const isDarkHeader = DARK_HEADER_PATHNAMES.some(
    (pathname) => pathname === router.pathname
  );

  const isBackButton = HEADER_BACK_BUTTON_PATHNAMES.some(
    (pathname) => pathname === router.pathname
  );

  return (
    <>
      <Meta />
      <GlobalHeader dark={isDarkHeader} backButton={isBackButton} />
      <VideoPlayer />
      {children}
    </>
  );
};

export default Layout;
