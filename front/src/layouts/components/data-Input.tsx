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
  const labelToShow = props.value != null || props.value != undefined ? '' : props.name;
  const valueToShow =
    props.value === -100 ||
    Number.isNaN(props.value) ||
    props.value === null ||
    props.value === undefined
      ? ''
      : props.value;

  return props.adornment ? (
    <TextField
      fullWidth
      id="outlined-suffix-shrink"
      label={labelToShow}
      variant="outlined"
      type="number"
      value={valueToShow}
      onChange={props.onChange}
      InputProps={{
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
      }}
    />
  ) : props.maxValue || props.minValue ? (
    <TextField
      fullWidth
      id="outlined-suffix-shrink"
      label={labelToShow}
      variant="outlined"
      value={valueToShow}
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
      label={labelToShow}
      variant="outlined"
      value={valueToShow}
      onChange={props.onChange}
      type="number"
    />
  );
}

export default DataInput;
