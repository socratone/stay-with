import { MenuProps, styled } from '@mui/material';
import Menu from '@mui/material/Menu';
import { useEffect, useState } from 'react';
import { PRIMARY_SHADOW } from 'theme/shadows';

const SmallMenu = styled((props: MenuProps) => {
  const [offsetWidth, setOffsetWidth] = useState(34);

  const htmlElement = props.anchorEl as HTMLElement;

  useEffect(() => {
    if (htmlElement?.offsetWidth) {
      setOffsetWidth(htmlElement?.offsetWidth);
    }
  }, [htmlElement?.offsetWidth]);

  return (
    <Menu
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      PaperProps={{
        sx: {
          overflow: 'visible',
        },
      }}
      MenuListProps={{
        sx: {
          overflow: 'unset',
          '&::before': {
            bgcolor: (theme) => theme.palette.background.paper,
            backgroundImage:
              'linear-gradient(rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.12))',
            content: '""',
            display: 'block',
            position: 'absolute',
            width: 10,
            height: 10,
            top: 0,
            right: offsetWidth / 2,
            transform: 'translate(50%, -50%) rotate(45deg)',
          },
        },
      }}
      {...props}
    />
  );
})(({ theme }) => ({
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
