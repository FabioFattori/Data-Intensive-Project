import { useEffect, useState } from 'react';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { renderFallback } from 'src/routes/sections';

import { DashboardContent } from 'src/layouts/dashboard';
import { requestMaker } from 'src/layouts/core/requestMaker';

import GenericStatsComponent from './genericStatsComponent';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsOrderTimeline } from '../analytics-order-timeline';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import f1 from '../../../../public/assets/icons/glass/chart-bar-svgrepo-com.svg';
import f2 from '../../../../public/assets/icons/glass/chart-pie-svgrepo-com.svg';

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  const [genericStats, setGenericStats] = useState(null);
  const [specificStats, setSpecificStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    requestMaker('getStatistics')
      .then((response) => {
        console.log(response);
        setGenericStats(response.generic);
        setSpecificStats(response.specific);
        setHistory(response.history);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching statistics:', error);
        setLoading(false);
      });
  }, []);

  const f3 = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="48px"
      height="48px"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M21 21H7.8C6.11984 21 5.27976 21 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3 18.7202 3 17.8802 3 16.2V3M15 4V8M11 8V12M7 13V17M19 4V17"
        stroke="#000000"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ stroke: '#f1bb1c' }}
      />
    </svg>
  );

  return loading ? (
    renderFallback()
  ) : (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Generic Statistics of the Dataset 📊
      </Typography>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        {genericStats && <GenericStatsComponent genericStats={genericStats} />}

        {specificStats &&
          Object.keys(specificStats).map((stat: string, index: number) => {
            // Estrai le chiavi da visualizzare escludendo 'name'
            console.log(stat);

            if (['mean_absolute_error', 'mean_squared_error', 'r2_score'].includes(stat)) {
              console.log(specificStats[stat]);
              return (
                <Grid size={{ xs: 12, md: 6, lg: 3 }} key={index}>
                  <AnalyticsWidgetSummary
                    title={stat.replace(/_/g, ' ').toUpperCase()}
                    percent={0}
                    color={
                      stat == 'r2_score'
                        ? 'success'
                        : stat == 'mean_squared_error'
                          ? 'error'
                          : 'warning'
                    }
                    total={specificStats[stat]}
                    icon={
                      stat == 'mean_absolute_error' ? (
                        f3
                      ) : (
                        <img
                          alt="Weekly sales"
                          src={stat == 'r2_score' ? f1 : stat == 'mean_squared_error' ? f2 : 'null'}
                        />
                      )
                    }
                    chart={{
                      categories: [],
                      series: [],
                    }}
                  />
                </Grid>
              );
            } else {
              const cat = Object.keys(specificStats[stat]);
              let data = Object.values(specificStats[stat]) as number[];
              data = data.map((value) => Number(value.toFixed(2)));
              console.log(cat, data);

              return (
                <Grid size={{ xs: 12, md: 12, lg: 8 }} key={index}>
                  <AnalyticsWebsiteVisits
                    title={stat.replace(/_/g, ' ').toUpperCase()}
                    subheader=""
                    chart={{
                      categories: cat,
                      series: [{ name: stat.replace(/_/g, ' ').toUpperCase(), data: data }],
                    }}
                  />
                </Grid>
              );
            }
          })}

        {history && (
          <Grid size={{ xs: 12, md: 6, lg: 3 }}>
            <AnalyticsOrderTimeline title="Prediction timeline" list={history} />
          </Grid>
        )}
      </Grid>
    </DashboardContent>
  );
}
