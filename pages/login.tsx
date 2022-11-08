import { Box, Button } from '@mui/material';
import GlobalHeader from '../components/GlobalHeader';
import {
  useSession,
  signIn,
  signOut,
  getProviders,
  LiteralUnion,
  ClientSafeProvider,
} from 'next-auth/react';
import { GetServerSideProps, NextPage } from 'next';
import { BuiltInProviderType } from 'next-auth/providers';
import Image from 'next/image';
import kakaoLoginSrc from '../public/images/kakao_login_medium_narrow.png';

interface LoginProps {
  providers: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  >;
}

export const getServerSideProps: GetServerSideProps = async () => {
  const providers = await getProviders();
  return {
    props: { providers },
  };
};

const Login: NextPage<LoginProps> = ({ providers }) => {
  const { data: session } = useSession();

  const handleSignOut = () => {
    signOut();
  };

  return (
    <Box height="100vh" display="flex" flexDirection="column">
      <GlobalHeader />
      <Box
        flexGrow={1}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        {session ? (
          <Button variant="contained" onClick={handleSignOut}>
            로그아웃
          </Button>
        ) : (
          Object.values(providers).map((provider) => (
            <Box key={provider.name}>
              <Image
                src={kakaoLoginSrc}
                alt="kakao login"
                onClick={() => signIn(provider.id)}
                style={{ cursor: 'pointer' }}
              />
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
};

export default Login;
