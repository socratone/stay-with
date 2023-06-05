import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';

type TextToggleButtonGroupProps = {
  value: string;
  onChange: (value: string) => void;
  options: {
    value: string;
    label: string;
  }[];
};

const TextToggleButtonGroup: React.FC<TextToggleButtonGroupProps> = ({
  value,
  onChange,
  options,
}) => {
  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      color="primary"
      onChange={(_, value) => {
        // 선택 해제되지 않도록 null 값이 올 때에는 무시한다.
        if (value) {
          onChange(value);
        }
      }}
    >
      {options.map((option) => (
        <ToggleButton key={option.value} value={option.value}>
          <Typography sx={{ wordBreak: 'keep-all' }}>{option.label}</Typography>
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export default TextToggleButtonGroup;
