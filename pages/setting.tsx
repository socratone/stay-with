import { Container, FormControlLabel, FormGroup, Switch } from '@mui/material';
import GlobalFooter from '../components/GlobalFooter';
import GlobalHeader from '../components/GlobalHeader';
import useColorMode from '../hooks/context/useDarkMode';
import useScrollDirection from '../hooks/dom/useScrollDirection';

const Setting = () => {
  const { scrollDirection } = useScrollDirection();
  const { colorMode, setColorMode } = useColorMode();

  return (
    <>
      <GlobalHeader />

      <Container component="main" maxWidth="sm" sx={{ pt: 1 }}>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={colorMode === 'dark'}
                onChange={(event, checked) =>
                  setColorMode(checked ? 'dark' : 'light')
                }
              />
            }
            label="다크모드"
          />
        </FormGroup>
      </Container>

      <GlobalFooter hidden={scrollDirection === 'down'} />
    </>
  );
};

export default Setting;
