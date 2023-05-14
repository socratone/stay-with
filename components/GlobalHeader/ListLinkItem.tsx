import styled from '@emotion/styled';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Link, { LinkProps } from 'next/link';

const StyledLink = styled(Link)`
  display: block;
  width: 100%;
`;

type ListLinkItemProps = {
  href: LinkProps['href'];
  icon: React.ReactNode;
  label: string;
};

const ListLinkItem: React.FC<ListLinkItemProps> = ({ href, icon, label }) => {
  return (
    <StyledLink href={href} replace>
      <ListItem disablePadding>
        <ListItemButton>
          <ListItemIcon sx={{ minWidth: 40 }}>{icon}</ListItemIcon>
          <ListItemText primary={label} />
        </ListItemButton>
      </ListItem>
    </StyledLink>
  );
};

export default ListLinkItem;
