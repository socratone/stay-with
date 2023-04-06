import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Bible, BIBLE_OPTIONS } from 'constants/bible';
import { useState } from 'react';
import { Controller, SubmitHandler, UseFormReturn } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { AutocompleteOption } from 'types/mui';

export interface LexioDivinaFormValues {
  phrase: string;
  bible: AutocompleteOption<Bible>;
  chapter: string;
  verse: string;
  endChapter?: string;
  endVerse?: string;
  content: string;
}

interface LexioDivinaFormProps {
  form: UseFormReturn<LexioDivinaFormValues>;
  isRequested: boolean;
  defaultIsExpanded?: boolean;
  contentRows?: number;
  onSubmit: SubmitHandler<LexioDivinaFormValues>;
  onCancel: () => void;
}

const LexioDivinaForm: React.FC<LexioDivinaFormProps> = ({
  form,
  isRequested,
  defaultIsExpanded,
  contentRows,
  onSubmit,
  onCancel,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultIsExpanded);

  const {
    control,
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = form;

  const handleClickPlusButton = () => {
    setIsExpanded(true);
  };

  const handleClickMinusButton = () => {
    setIsExpanded(false);
    setValue('endChapter', '');
    setValue('endVerse', '');
  };

  return (
    <Box
      component="form"
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
      }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Box>
        <TextField
          {...register('phrase', {
            required: true,
            maxLength: 300,
          })}
          size="small"
          fullWidth
          multiline
          minRows={2}
          placeholder="마음에 와닿은 구절"
          error={!!errors.phrase}
        />
      </Box>

      <Box display="grid" gridTemplateColumns="1fr 1fr 1fr auto" gap={1.5}>
        <Box>
          <Controller
            control={control}
            name="bible"
            rules={{
              required: true,
            }}
            render={({ field }) => (
              <Autocomplete
                {...field}
                onChange={(_, newValue) => field.onChange(newValue)}
                disablePortal
                options={BIBLE_OPTIONS}
                renderInput={(params) => (
                  <TextField {...params} size="small" error={!!errors.bible} />
                )}
              />
            )}
          />
        </Box>
        <Box>
          <TextField
            {...register('chapter', {
              required: true,
              validate: {
                moreThanOne: (value) => Number(value) > 0,
              },
            })}
            size="small"
            placeholder="장"
            fullWidth
            type="number"
            error={!!errors.chapter}
          />
        </Box>
        <Box>
          <TextField
            {...register('verse', {
              required: true,
              validate: {
                moreThanOne: (value) => Number(value) > 0,
              },
            })}
            size="small"
            placeholder="절"
            fullWidth
            type="number"
            error={!!errors.verse}
          />
        </Box>
        <Box ml={-1.5} alignSelf="center">
          {isExpanded ? (
            <Typography color="text.primary" textAlign="end">
              에서
            </Typography>
          ) : (
            <IconButton onClick={handleClickPlusButton}>
              <AddCircleOutlineIcon />
            </IconButton>
          )}
        </Box>

        {isExpanded ? (
          <>
            <Box justifySelf="flex-end" alignSelf="center" mr={-1.5}>
              <IconButton onClick={handleClickMinusButton}>
                <RemoveCircleOutlineIcon />
              </IconButton>
            </Box>
            <Box>
              <TextField
                {...register('endChapter', {
                  validate: {
                    onlyPlus: (value) => !value || Number(value) >= 1,
                    moreThanStartChapter: (value) =>
                      !value || Number(value) >= Number(getValues('chapter')),
                    haveBoth: (value) =>
                      (!!value && !!getValues('endVerse')) ||
                      (!value && !getValues('endVerse')),
                  },
                })}
                size="small"
                placeholder="장"
                fullWidth
                type="number"
                error={!!errors.endChapter}
              />
            </Box>
            <Box>
              <TextField
                {...register('endVerse', {
                  validate: {
                    onlyPlus: (value) => !value || Number(value) >= 1,
                    moreThanStarted: (value) =>
                      !value ||
                      Number(getValues('chapter')) <
                        Number(getValues('endChapter')) ||
                      Number(value) > Number(getValues('verse')),
                    haveBoth: (value) =>
                      (!!value && !!getValues('endChapter')) ||
                      (!value && !getValues('endChapter')),
                  },
                })}
                size="small"
                placeholder="절"
                fullWidth
                type="number"
                error={!!errors.endVerse}
              />
            </Box>
            <Box alignSelf="center">
              <Typography color="text.primary" textAlign="end">
                까지
              </Typography>
            </Box>
          </>
        ) : null}
      </Box>

      <Box>
        <Controller
          control={control}
          name="content"
          rules={{
            required: true,
            minLength: 10,
            maxLength: 3000,
          }}
          render={({ field }) => (
            <TextField
              {...field}
              size="small"
              fullWidth
              multiline
              minRows={contentRows}
              placeholder="구절을 통해 느낀점"
              error={!!errors.content}
            />
          )}
        />
      </Box>

      <Box display="flex" justifyContent="flex-end" gap={1}>
        <Button variant="outlined" onClick={onCancel}>
          <FormattedMessage id="common.cancel" />
        </Button>
        <Button type="submit" variant="contained" disabled={isRequested}>
          <FormattedMessage id="common.save" />
        </Button>
      </Box>
    </Box>
  );
};

export default LexioDivinaForm;
