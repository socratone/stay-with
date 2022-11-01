import {
  Box,
  Container,
  FormControlLabel,
  FormGroup,
  Switch,
} from '@mui/material';
import { useState } from 'react';
import GlobalFooter from '../components/GlobalFooter';
import GlobalHeader from '../components/GlobalHeader';
import useScrollDirection from '../hooks/dom/useScrollDirection';

const Setting = () => {
  const { scrollDirection } = useScrollDirection();

  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <>
      <GlobalHeader />

      <Container component="main" maxWidth="sm" sx={{ pt: 1 }}>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={isDarkMode}
                onChange={(event, checked) => setIsDarkMode(checked)}
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
