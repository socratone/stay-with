import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import SettingsLayout from 'feature/SettingsLayout/SettingsLayout';
import getYouTubeID from 'get-youtube-id';
import { enqueueSnackbar } from 'notistack';
import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { getJsonValue, setJsonValue } from 'utils/persist';

type FormValues = {
  videos: { url: string }[];
};

const SettingsMusic = () => {
  const { formatMessage } = useIntl();
  const { register, handleSubmit, control, watch, formState, reset } =
    useForm<FormValues>({
      defaultValues: {
        videos: [
          {
            url: 'https://www.youtube.com/watch?v=f742p7mQ0Ic',
          },
        ],
      },
    });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'videos',
  });

  const watchVideos = watch('videos');
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchVideos[index],
    };
  });

  useEffect(() => {
    const videoUrls = getJsonValue<string[]>('videoUrls');
    if (Array.isArray(videoUrls)) {
      const videos = videoUrls.map((url) => ({ url }));
      if (videos.length > 0) {
        reset({
          videos,
        });
      }
    }
  }, [reset]);

  const validateYoutubeId = (url: string) => {
    const videoId = getYouTubeID(url);
    if (!videoId) return false;
    if (videoId.length !== 11) return false;
    return true;
  };

  const onSubmit = (data: FormValues) => {
    setJsonValue(
      'videoUrls',
      data.videos.map((video) => video.url.trim())
    );
    enqueueSnackbar(formatMessage({ id: 'success.message.saved' }), {
      variant: 'success',
    });
  };

  const handleAppend = () => {
    append({
      url: '',
    });
  };

  const handleRemove = (index: number) => {
    remove(index);
  };

  return (
    <SettingsLayout>
      <Box component="form" py={1.5} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={1.5}>
          <Box>
            <Typography
              color="text.primary"
              component="h2"
              fontWeight={500}
              variant="body1"
              mb={0.5}
            >
              배경 음악 리스트
            </Typography>
            <Typography color="text.secondary" mb={1}>
              원하는 유튜브 음악 영상의 주소를 붙여 넣으세요.
            </Typography>
            <Stack gap={1}>
              {controlledFields.map((field, index) => {
                return (
                  <Stack key={field.id} gap={1}>
                    {getYouTubeID(field.url) ? (
                      <Box
                        component="iframe"
                        width={200}
                        height={113}
                        src={`https://www.youtube.com/embed/${getYouTubeID(
                          field.url
                        )}`}
                        sx={{
                          border: 0,
                          borderRadius: 3,
                        }}
                      />
                    ) : (
                      <Skeleton
                        variant="rectangular"
                        width={200}
                        height={113}
                        animation={false}
                        sx={{
                          borderRadius: 3,
                        }}
                      />
                    )}
                    <Stack direction="row">
                      <TextField
                        placeholder="https://www.youtube.com/watch?v=f742p7mQ0Ic"
                        fullWidth
                        size="small"
                        error={
                          formState.errors.videos &&
                          !validateYoutubeId(field.url)
                        }
                        {...register(`videos.${index}.url` as const, {
                          validate: validateYoutubeId,
                        })}
                      />
                      {index === 0 ? (
                        <IconButton onClick={handleAppend}>
                          <AddIcon />
                        </IconButton>
                      ) : (
                        <IconButton onClick={() => handleRemove(index)}>
                          <RemoveIcon />
                        </IconButton>
                      )}
                    </Stack>
                  </Stack>
                );
              })}
            </Stack>
          </Box>
          <Box>
            <Button variant="contained" type="submit">
              저장하기
            </Button>
          </Box>
        </Stack>
      </Box>
    </SettingsLayout>
  );
};

export default SettingsMusic;
