import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Image from 'next/image';

type ImageToggleButtonGroupProps = {
  value: string;
  onChange: (value: string) => void;
  options: {
    value: string;
    image: {
      src: string;
      alt: string;
      width: number;
      height: number;
    };
  }[];
};

const ImageToggleButtonGroup: React.FC<ImageToggleButtonGroupProps> = ({
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
      sx={{
        gap: 1,
        flexWrap: 'wrap',
      }}
    >
      {options.map((option) => (
        <ToggleButton
          key={option.value}
          value={option.value}
          sx={{
            padding: 0,
            border: 0,
            display: 'block',
            lineHeight: 0,
          }}
        >
          <Image
            src={option.image.src}
            alt={option.image.alt}
            width={option.image.width}
            height={option.image.height}
          />
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export default ImageToggleButtonGroup;
