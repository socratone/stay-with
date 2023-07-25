import GlobalHeader from 'components/GlobalHeader';
import Meta from 'components/Meta';
import VideoPlayer from 'components/VideoPlayer';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Meta />
      <GlobalHeader />
      <VideoPlayer />
      {children}
    </>
  );
};

export default Layout;
