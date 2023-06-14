import AccessibilityIcon from '@mui/icons-material/Accessibility';
import PianoIcon from '@mui/icons-material/Piano';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import List from '@mui/material/List';
import GlobalHeader from 'components/GlobalHeader/GlobalHeader';
import Meta from 'components/Meta/Meta';
import SideNavLinkItem from 'components/SideNavLinkItem/SideNavLinkItem';

type SettingsLayoutProps = {
  children: React.ReactNode;
};

const SettingsLayout: React.FC<SettingsLayoutProps> = ({ children }) => {
  return (
    <>
      <Meta />
      <GlobalHeader />
      <Container>
        <Box
          display="grid"
          gridTemplateColumns={{ xs: '1fr', md: '250px 1fr', lg: '250px 1fr' }}
          gap={{ xs: 0, md: 2, lg: 2 }}
        >
          {/* Side nav */}
          <Box component="nav">
            <List sx={{ py: 0 }}>
              <SideNavLinkItem
                href="/settings/profile"
                icon={<AccessibilityIcon />}
              >
                프로필
              </SideNavLinkItem>
              <SideNavLinkItem href="/settings/display" icon={<WbSunnyIcon />}>
                디스플레이
              </SideNavLinkItem>
              <SideNavLinkItem href="/settings/music" icon={<PianoIcon />}>
                음악
              </SideNavLinkItem>
            </List>
          </Box>
          {/* Main */}
          <Box component="main">{children}</Box>
        </Box>
      </Container>
    </>
  );
};

export default SettingsLayout;
