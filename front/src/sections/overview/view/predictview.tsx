import React from 'react';

import InfoIcon from '@mui/icons-material/Info';
import { TransitionProps } from '@mui/material/transitions';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Popover,
  Select,
  Slide,
  Typography,
} from '@mui/material';

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
  const [color, setColor] = React.useState(1 as 1 | 0);
  const [prediction, setPrediction] = React.useState('');

  const units = [
    { label: 'big', value: 'g/dm³' },
    { label: 'sulfur', value: 'mg/dm³' },
    { label: 'alcohol', value: '% vol' },
  ];

  const inputsSizes = { xs: 12, md: 6, lg: 3 };

  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopOver = () => {
    setAnchorEl(null);
  };

  const openPopover = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleClose = () => {
    setOpen(false);
  };

  const useDefaultValues = () => {
    setFixedAcidity(7.4);
    setVolatileAcidity(0.7);
    setCitricAcid(0.0);
    setResidualSugar(1.9);
    setChlorides(0.076);
    setFreeSulfurDioxide(11.0);
    setTotalSulfurDioxide(34.0);
    setDensity(0.9978);
    setPH(3.51);
    setSulphates(0.56);
    setAlcohol(9.4);
    setColor(1);
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

  const getPercentage = (value: number | null) => {
    if (value === null) return 'N/A';
    return `${(value * 100).toFixed(2)}%`;
  }

  const handlePredictionResponse = (response: any) => {
    const pred = response;
    if (Array.isArray(pred)) {
      if (pred.length == 1) {
        setPrediction(`The predicted quality is: ${pred[0]}`);
      }
    } else if (Object.keys(pred).length == 2) {
      // SVM Binary Classification
      setPrediction(
        `The Wine is: ${pred['1'] > pred['0'] ? 'Good (quality >= 7)' : 'Bad'} (${getPercentage(pred['0'])} vs ${getPercentage(pred['1'])})`
      );
    } else if (Object.keys(pred).length == 4) {
      // SVM Multi Classification
      // 0: Bianco Cattivo (quality < 7, color = 0)
      // 1: Bianco Buono (quality >= 7, color = 0)
      // 2: Rosso Cattivo (quality < 7, color = 1)
      // 3: Rosso Buono (quality >= 7, color = 1)
      setPrediction(
        `The Wine is: ${
          pred['0'] > pred['1'] && pred['0'] > pred['2'] && pred['0'] > pred['3']
            ? 'White Bad (quality < 7, color = 0)'
            : pred['1'] > pred['0'] && pred['1'] > pred['2'] && pred['1'] > pred['3']
            ? 'White Good (quality >= 7, color = 0)'
            : pred['2'] > pred['0'] && pred['2'] > pred['1'] && pred['2'] > pred['3']
            ? 'Red Bad (quality < 7, color = 1)'
            : 'Red Good (quality >= 7, color = 1)'
        } (${getPercentage(pred['0'])} vs ${getPercentage(pred['1'])} vs ${getPercentage(pred['2'])} vs ${getPercentage(pred['3'])})`
      );
    }
  };

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Predict Panel 🔮{' '}
        <IconButton aria-label="info" onClick={handleClick}>
          <InfoIcon />
        </IconButton>
      </Typography>
      <Popover
        open={openPopover}
        anchorEl={anchorEl}
        onClose={handleClosePopOver}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
      >
        <Typography sx={{ p: 1 }}>Example Values:</Typography>
        <Box sx={{ p: 2 }}>
          <Typography>Fixed Acidity: 7.4</Typography>
          <Typography>Volatile Acidity: 0.70</Typography>
          <Typography>Citric Acid: 0.00</Typography>
          <Typography>Residual Sugar: 1.9</Typography>
          <Typography>Chlorides: 0.076</Typography>
          <Typography>Free Sulfur Dioxide: 11.0</Typography>
          <Typography>Total Sulfur Dioxide: 34.0</Typography>
          <Typography>Density: 0.9978</Typography>
          <Typography>pH: 3.51</Typography>
          <Typography>Sulphates: 0.56</Typography>
          <Typography>Alcohol: 9.4</Typography>
          <Typography>Color: Red</Typography>
          <Button variant="outlined" fullWidth onClick={useDefaultValues} sx={{ mt: 2 }}>
            Use Example Values
          </Button>
        </Box>
      </Popover>

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
          <Grid size={inputsSizes}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Color</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={color}
                label="Age"
                onChange={(e) => setColor(e.target.value as 1 | 0)}
              >
                <MenuItem value={0}>White</MenuItem>
                <MenuItem value={1}>Red</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid container spacing={6} padding={3}>
          <Grid size={8}>
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
                  color: color,
                })
                  .then((response) => {
                    handlePredictionResponse(response.prediction);
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
          <Grid size={4}>
            <Button
              style={{ height: '100%' }}
              variant="outlined"
              fullWidth
              onClick={() => {
                setFixedAcidity(null);
                setVolatileAcidity(null);
                setCitricAcid(null);
                setResidualSugar(null);
                setChlorides(null);
                setFreeSulfurDioxide(null);
                setTotalSulfurDioxide(null);
                setDensity(null);
                setPH(null);
                setSulphates(null);
                setAlcohol(null);
                setColor(1);
                setPrediction('');
              }}
            >
              Reset Variables
            </Button>
          </Grid>
        </Grid>
      </Card>

      {prediction && (
        <Card sx={{ xs: 12, md: 6, lg: 4, mt: 3 }}>
          <CardHeader
            title="Prediction Result"
            subheader="The result of the prediction will be here"
          />
          <Box sx={{ p: 3 }}>
            <Typography variant="h5">{prediction}</Typography>
          </Box>
        </Card>
      )}

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
