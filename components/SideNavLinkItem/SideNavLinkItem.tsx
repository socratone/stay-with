import styled from '@emotion/styled';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

type SideNavLinkItemProps = {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
};

const StyledLink = styled(Link)`
  display: block;
  width: 100%;
`;

const SideNavLinkItem: React.FC<SideNavLinkItemProps> = ({
  href,
  icon,
  children,
}) => {
  return (
    <ListItem disablePadding>
      <StyledLink href={href}>
        <ListItemButton sx={{ px: { xs: 0, md: 2, lg: 2 } }}>
          <ListItemIcon sx={{ minWidth: 24, mr: '0.75rem' }}>
            {icon}
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography color={(theme) => theme.palette.text.primary}>
                {children}
              </Typography>
            }
          />
        </ListItemButton>
      </StyledLink>
    </ListItem>
  );
};

export default SideNavLinkItem;
