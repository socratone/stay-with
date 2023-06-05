import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import { useState } from 'react';

type ProfileAvatarProps = {
  src?: string;
  size:
    | '3rem' // 48px
    | '2.125rem'; // 34px
  children?: React.ReactNode;
};

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  src,
  size,
  children,
}) => {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setIsError(true);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  if (children) {
    return <Avatar sx={{ width: size, height: size }}>{children}</Avatar>;
  }

  if (isError) {
    return <Avatar sx={{ width: size, height: size }} />;
  }

  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        position: 'relative',
      }}
    >
      {isLoading ? (
        <Avatar
          sx={{
            width: size,
            height: size,
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 2,
          }}
        />
      ) : null}
      <Avatar
        alt="profile"
        src={src}
        onError={handleError}
        onLoad={handleLoad}
        sx={{ width: size, height: size }}
      />
    </Box>
  );
};

export default ProfileAvatar;
