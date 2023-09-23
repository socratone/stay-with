import styled from '@emotion/styled';
import Chip from '@mui/material/Chip';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Link, { LinkProps } from 'next/link';

const StyledLink = styled(Link)`
  display: block;
  width: 100%;
`;

type ListLinkItemProps = {
  href: LinkProps['href'];
  icon: React.ReactNode;
  label: string;
  beta?: true;
};

const ListLinkItem: React.FC<ListLinkItemProps> = ({
  href,
  icon,
  label,
  beta,
}) => {
  return (
    <StyledLink href={href} replace>
      <ListItem disablePadding>
        <ListItemButton>
          <ListItemIcon sx={{ minWidth: 24, mr: '0.75rem' }}>
            {icon}
          </ListItemIcon>
          <ListItemText
            primary={
              <Stack direction="row" alignItems="center" gap={0.5}>
                {label}
                {beta ? (
                  <Chip
                    label="BETA"
                    color="warning"
                    size="small"
                    sx={{ cursor: 'pointer' }}
                  />
                ) : null}
              </Stack>
            }
          />
        </ListItemButton>
      </ListItem>
    </StyledLink>
  );
};

export default ListLinkItem;
