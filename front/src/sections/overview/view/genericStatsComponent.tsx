import { Grid } from '@mui/material';

import { AnalyticsCurrentVisits } from '../analytics-current-visits';


interface GenericStatsComponentProps {
  genericStats: [key: number, value: number][];
}

function GenericStatsComponent(props: GenericStatsComponentProps) {
  return (
    <Grid container spacing={3}>
      {Object.keys(props.genericStats).map((stat : any, index) => {
        // Estrai le chiavi da visualizzare escludendo 'name'
        const dataKeys = Object.keys(props.genericStats[stat]).filter((key) => key !== 'name');
        // Prepara i dati per il grafico
        const seriesData = dataKeys.map((key) => ({
          label: key.charAt(0).toUpperCase() + key.slice(1), // es. "bad" → "Bad"
          value: props.genericStats[stat][key as any],
        }));

        return (
          <Grid key={index} size={{ xs: 12, md: 6, lg: 4 }}>
            <AnalyticsCurrentVisits
              title={props.genericStats[stat]['name' as any] as unknown as string}
              chart={{
                series: seriesData,
              }}
            />
          </Grid>
        );
      })}

      {/* <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <AnalyticsWebsiteVisits
            title="Website visits"
            subheader="(+43%) than last year"
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
              series: [
                { name: 'Team A', data: [43, 33, 22, 37, 67, 68, 37, 24, 55] },
                { name: 'Team B', data: [51, 70, 47, 67, 40, 37, 24, 70, 24] },
              ],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <AnalyticsConversionRates
            title="Conversion rates"
            subheader="(+43%) than last year"
            chart={{
              categories: ['Italy', 'Japan', 'China', 'Canada', 'France'],
              series: [
                { name: '2022', data: [44, 55, 41, 64, 22] },
                { name: '2023', data: [53, 32, 33, 52, 13] },
              ],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AnalyticsCurrentSubject
            title="Current subject"
            chart={{
              categories: ['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math'],
              series: [
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <AnalyticsNews title="News" list={_posts.slice(0, 5)} />
        </Grid>

        

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AnalyticsTrafficBySite title="Traffic by site" list={_traffic} />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <AnalyticsTasks title="Tasks" list={_tasks} />
        </Grid> */}
    </Grid>
  );
}

export default GenericStatsComponent;
