import styled from '@emotion/styled';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import GlobalHeader from 'components/GlobalHeader/GlobalHeader';
import Meta from 'components/Meta/Meta';
import Link from 'next/link';

const StyledLink = styled(Link)`
  display: block;
  width: 100%;
`;

const SettingsProfile = () => {
  return (
    <>
      <Meta />
      <GlobalHeader />
      <Container>
        <Box display="grid" gridTemplateColumns="250px 1fr" gap={1}>
          <Box>
            <List sx={{ pt: 0 }}>
              <ListItem disablePadding>
                <StyledLink href="/settings/profile">
                  <ListItemButton>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <AccessibilityIcon />
                    </ListItemIcon>
                    <ListItemText primary="프로필" />
                  </ListItemButton>
                </StyledLink>
              </ListItem>
            </List>
          </Box>
          <Box py={1}>
            {/* TODO: typography 사이즈 어떻게 해야할지 정하기 */}
            <Typography component="h2" variant="h6">
              이름
            </Typography>
            <TextField size="small" />
            <Typography component="h2" variant="h6">
              소개
            </Typography>
            <TextField size="small" />
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default SettingsProfile;
