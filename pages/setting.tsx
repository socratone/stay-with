import {
  Container,
  FormControlLabel,
  FormGroup,
  Switch,
  Typography,
} from '@mui/material';
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
            label={<Typography color="text.primary">다크모드</Typography>}
          />
        </FormGroup>
      </Container>

      <GlobalFooter hidden={scrollDirection === 'down'} />
    </>
  );
};

export default Setting;
