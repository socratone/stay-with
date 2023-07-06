import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

type StartingPrayerDialogProps = {
  open: boolean;
  onClose: () => void;
};

const StartingPrayerDialog: React.FC<StartingPrayerDialogProps> = ({
  open,
  onClose,
}) => {
  return (
    <Dialog
      open={open}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
        },
      }}
      onClose={onClose}
    >
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between">
          성령 송가
          <IconButton onClick={onClose} sx={{ my: -1 }}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Typography textAlign="center" sx={{ whiteSpace: 'pre-line' }}>
          {`오소서, 성령님.
당신의 빛 그 빛살을
하늘에서 내리소서.

가난한 이 아버지,
은총의 주님
오시어 마음에 빛을 주소서.

가장 좋은 위로자,
영혼의 기쁜 손님,
생기 돋워 주소서.

일할 때에 휴식을,
무더울 때 바람을,
슬플 때에 위로를.

지복의 빛이시여,
저희 맘 깊은 곳을
가득히 채우소서.

주님 도움 없으면
저희 삶 그 모든 것
이로운 것 없으리.

허물은 씻어 주고
마른 땅 물 주시고
병든 것 고치소서.

굳은 맘 풀어 주고
찬 마음 데우시고
바른 길 이끄소서.

성령님을 믿으며
의지하는 이에게
칠은을 베푸소서.

공덕을 쌓게 하고
구원의 문을 넘어
영복을 얻게 하소서.

아멘.`}
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default StartingPrayerDialog;
