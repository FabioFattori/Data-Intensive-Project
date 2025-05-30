import React from 'react';

import { InputAdornment, TextField } from '@mui/material';
import { inputBaseClasses } from '@mui/material/InputBase';

interface DataInputProps {
  adornment?: string;
  name: string;
  value: any;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  maxValue?: number;
  minValue?: number;
}

function DataInput(props: DataInputProps) {
  return props.adornment ? (
    <TextField
      fullWidth
      id="outlined-suffix-shrink"
      label={props.name}
      variant="outlined"
      value={props.value}
      onChange={props.onChange}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment
              position="end"
              sx={{
                opacity: 0,
                pointerEvents: 'none',
                [`[data-shrink=true] ~ .${inputBaseClasses.root} > &`]: {
                  opacity: 1,
                },
              }}
            >
              {props.adornment}
            </InputAdornment>
          ),
        },
      }}
    />
  ) : props.maxValue || props.minValue ? (
    <TextField
      fullWidth
      id="outlined-suffix-shrink"
      label={props.name}
      variant="outlined"
      value={props.value}
      onChange={props.onChange}
      inputProps={{
        max: props.maxValue,
        min: props.minValue,
      }}
      type="number"
    />
  ) : (
    <TextField
      fullWidth
      id="outlined-suffix-shrink"
      label={props.name}
      variant="outlined"
      value={props.value}
      onChange={props.onChange}
    />
  );
}

export default DataInput;
