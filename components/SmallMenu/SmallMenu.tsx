import { MenuProps, styled } from '@mui/material';
import Menu from '@mui/material/Menu';
import { PRIMARY_SHADOW } from 'theme/shadows';

const SmallMenu = styled((props: MenuProps) => (
  <Menu
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '.MuiPaper-root': {
    color:
      theme.palette.mode === 'light'
        ? 'rgb(55, 65, 81)'
        : theme.palette.grey[300],
    boxShadow: PRIMARY_SHADOW,
    '& .MuiMenu-list': {
      padding: 0,
    },
    '& .MuiMenuItem-root': {
      minHeight: '2.5rem', // 40px
      paddingTop: 0,
      paddingBottom: 0,
      fontSize: '0.938rem', // 15px
      '& .MuiSvgIcon-root': {
        fontSize: '1.125rem', // 18px
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
    },
  },
}));

export default SmallMenu;
