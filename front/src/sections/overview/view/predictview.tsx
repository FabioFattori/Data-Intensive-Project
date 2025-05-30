import React from 'react';

import { TransitionProps } from '@mui/material/transitions';
import {
  Button,
  Card,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Slide,
  Typography,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

import { DashboardContent } from 'src/layouts/dashboard';
import DataInput from 'src/layouts/components/data-Input';
import { requestMaker } from 'src/layouts/core/requestMaker';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function PredictView() {
  const [fixedAcidity, setFixedAcidity] = React.useState(null as number | null);
  const [volatileAcidity, setVolatileAcidity] = React.useState(null as number | null);
  const [citricAcid, setCitricAcid] = React.useState(null as number | null);
  const [residualSugar, setResidualSugar] = React.useState(null as number | null);
  const [chlorides, setChlorides] = React.useState(null as number | null);
  const [freeSulfurDioxide, setFreeSulfurDioxide] = React.useState(null as number | null);
  const [totalSulfurDioxide, setTotalSulfurDioxide] = React.useState(null as number | null);
  const [density, setDensity] = React.useState(null as number | null);
  const [pH, setPH] = React.useState(null as number | null);
  const [sulphates, setSulphates] = React.useState(null as number | null);
  const [alcohol, setAlcohol] = React.useState(null as number | null);
  const [prediction, setPrediction] = React.useState('');

  const units = [
    { label: 'big', value: 'g/dm³' },
    { label: 'sulfur', value: 'mg/dm³' },
    { label: 'alcohol', value: '% vol' },
  ];

  const inputsSizes = { xs: 12, md: 6, lg: 3 };

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getWhichVariablesAreNull = () => {
    const variables = [
      fixedAcidity,
      volatileAcidity,
      citricAcid,
      residualSugar,
      chlorides,
      freeSulfurDioxide,
      totalSulfurDioxide,
      density,
      pH,
      sulphates,
      alcohol,
    ];

    const variableNames = [
      'Fixed Acidity',
      'Volatile Acidity',
      'Citric Acid',
      'Residual Sugar',
      'Chlorides',
      'Free Sulfur Dioxide',
      'Total Sulfur Dioxide',
      'Density',
      'pH',
      'Sulphates',
      'Alcohol',
    ];

    return variables.map((value, index) =>
      value === null ? `${variableNames[index]} is Mandatory` : null
    );
  };

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Predict Panel 🔮{' '}
        <IconButton aria-label="info">
          <InfoIcon />
        </IconButton>
      </Typography>

      <Card sx={{ xs: 12, md: 6, lg: 4 }}>
        <CardHeader
          title="Necessary data for Prediction"
          subheader="write the data, then click submit and wait for the prediction!"
        />
        <Grid container spacing={3} padding={3}>
          <Grid size={inputsSizes}>
            <DataInput
              adornment={units[0].value}
              name="Fixed Acidity"
              value={fixedAcidity}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFixedAcidity(Number(e.target.value))
              }
            />
          </Grid>
          <Grid size={inputsSizes}>
            <DataInput
              name="Volatile Acidity"
              adornment={units[0].value}
              value={volatileAcidity}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setVolatileAcidity(Number(e.target.value))
              }
            />
          </Grid>
          <Grid size={inputsSizes}>
            <DataInput
              name="Citric Acid"
              adornment={units[0].value}
              value={citricAcid}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCitricAcid(Number(e.target.value))
              }
            />
          </Grid>
          <Grid size={inputsSizes}>
            <DataInput
              name="Residual Sugar"
              adornment={units[0].value}
              value={residualSugar}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setResidualSugar(Number(e.target.value))
              }
            />
          </Grid>
          <Grid size={inputsSizes}>
            <DataInput
              name="Chlorides"
              adornment={units[0].value}
              value={chlorides}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setChlorides(Number(e.target.value))
              }
            />
          </Grid>
          <Grid size={inputsSizes}>
            <DataInput
              name="Free Sulfur Dioxide"
              adornment={units[1].value}
              value={freeSulfurDioxide}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFreeSulfurDioxide(Number(e.target.value))
              }
            />
          </Grid>
          <Grid size={inputsSizes}>
            <DataInput
              name="Total Sulfur Dioxide"
              adornment={units[1].value}
              value={totalSulfurDioxide}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTotalSulfurDioxide(Number(e.target.value))
              }
            />
          </Grid>
          <Grid size={inputsSizes}>
            <DataInput
              name="Density"
              adornment={units[0].value}
              value={density}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setDensity(Number(e.target.value))
              }
            />
          </Grid>
          <Grid size={inputsSizes}>
            <DataInput
              name="pH"
              value={pH}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPH(Number(e.target.value))}
              minValue={0}
              maxValue={14}
            />
          </Grid>
          <Grid size={inputsSizes}>
            <DataInput
              name="Sulphates"
              adornment={units[0].value}
              value={sulphates}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSulphates(Number(e.target.value))
              }
            />
          </Grid>
          <Grid size={inputsSizes}>
            <DataInput
              name="Alcohol"
              adornment={units[2].value}
              value={alcohol}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setAlcohol(Number(e.target.value))
              }
            />
          </Grid>
        </Grid>
        <Grid container padding={3}>
          <Grid size={12}>
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={async () => {
                if (
                  fixedAcidity === null ||
                  volatileAcidity === null ||
                  citricAcid === null ||
                  residualSugar === null ||
                  chlorides === null ||
                  freeSulfurDioxide === null ||
                  totalSulfurDioxide === null ||
                  density === null ||
                  pH === null ||
                  sulphates === null ||
                  alcohol === null
                ) {
                  setOpen(true);
                  return;
                }

                requestMaker('predict', {
                  fixed_acidity: fixedAcidity,
                  volatile_acidity: volatileAcidity,
                  citric_acid: citricAcid,
                  residual_sugar: residualSugar,
                  chlorides: chlorides,
                  free_sulfur_dioxide: freeSulfurDioxide,
                  total_sulfur_dioxide: totalSulfurDioxide,
                  density: density,
                  pH: pH,
                  sulphates: sulphates,
                  alcohol: alcohol,
                })
                  .then((response) => {
                    setPrediction(response.prediction);
                    console.log('Prediction:', response.prediction);
                  })
                  .catch((error) => {
                    console.error('Error during prediction:', error);
                    setPrediction('Error during prediction');
                  });
              }}
            >
              Predict!
            </Button>
          </Grid>
        </Grid>
      </Card>

      <Dialog
        open={open}
        slots={{
          transition: Transition,
        }}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>
          {getWhichVariablesAreNull().filter((message) => message !== null).length > 1
            ? 'Those variables are '
            : 'This variable is '}{' '}
          Mandatory
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {getWhichVariablesAreNull().filter((message) => message !== null)}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            I Will Fill{' '}
            {getWhichVariablesAreNull().filter((message) => message !== null).length > 1
              ? 'Those'
              : 'It'}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}

export default PredictView;
