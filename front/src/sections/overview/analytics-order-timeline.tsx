import type { CardProps } from '@mui/material/Card';
import type { TimelineItemProps } from '@mui/lab/TimelineItem';

import Card from '@mui/material/Card';
import Timeline from '@mui/lab/Timeline';
import TimelineDot from '@mui/lab/TimelineDot';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';

import { fDateTime } from 'src/utils/format-time';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  list: {
    model: string;
    prediction: string;
    date: string;
  }[];
};

export function AnalyticsOrderTimeline({ title, subheader, list, sx, ...other }: Props) {
  return (
    <Card sx={sx} {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Timeline
        sx={{ m: 0, p: 3, [`& .${timelineItemClasses.root}:before`]: { flex: 0, padding: 0 } }}
      >
        {list.length > 0 ? (
          list.map((item, index) => (
            <Item key={index} item={item} lastItem={index === list.length - 1} />
          ))
        ) : (
          <TimelineItem>
            <TimelineContent>
              <Typography variant="subtitle1" color="text.secondary">
                No predictions made yet.
              </Typography>
            </TimelineContent>
          </TimelineItem>
        )}
      </Timeline>
    </Card>
  );
}

// ----------------------------------------------------------------------

type ItemProps = TimelineItemProps & {
  lastItem: boolean;
  item: Props['list'][number];
};

const getPercentage = (value: number | null) => {
  if (value === null) return 'N/A';
  return `${(value * 100).toFixed(2)}%`;
};

function handlePrediction(pred: any): string {
  if (Array.isArray(pred)) {
    if (pred.length == 1) {
      return `The predicted quality is: ${pred[0]}`;
    }
  } else if (Object.keys(pred).length == 2) {
    // SVM Binary Classification
    return `The Wine is: ${pred['1'] > pred['0'] ? 'Good (quality >= 7)' : 'Bad'} (${getPercentage(pred['0'])} vs ${getPercentage(pred['1'])})`;
  } else if (Object.keys(pred).length == 4) {
    // SVM Multi Classification
    // 0: Bianco Cattivo (quality < 7, color = 0)
    // 1: Bianco Buono (quality >= 7, color = 0)
    // 2: Rosso Cattivo (quality < 7, color = 1)
    // 3: Rosso Buono (quality >= 7, color = 1)
    return `The Wine is: ${
      pred['0'] > pred['1'] && pred['0'] > pred['2'] && pred['0'] > pred['3']
        ? 'White Bad (quality < 7, color = 0)'
        : pred['1'] > pred['0'] && pred['1'] > pred['2'] && pred['1'] > pred['3']
          ? 'White Good (quality >= 7, color = 0)'
          : pred['2'] > pred['0'] && pred['2'] > pred['1'] && pred['2'] > pred['3']
            ? 'Red Bad (quality < 7, color = 1)'
            : 'Red Good (quality >= 7, color = 1)'
    } (${getPercentage(pred['0'])} vs ${getPercentage(pred['1'])} vs ${getPercentage(pred['2'])} vs ${getPercentage(pred['3'])})`;
  }
  return '';
}

function Item({ item, lastItem, ...other }: ItemProps) {
  return (
    <TimelineItem {...other}>
      <TimelineSeparator>
        <TimelineDot
          color={
            'error'
            // (item.type === 'order1' && 'primary') ||
            // (item.type === 'order2' && 'success') ||
            // (item.type === 'order3' && 'info') ||
            // (item.type === 'order4' && 'warning') ||
            // 'error'
          }
        />
        {lastItem ? null : <TimelineConnector />}
      </TimelineSeparator>

      <TimelineContent>
        <Typography variant="subtitle1">{item.model}</Typography>
        <Typography variant="subtitle2">{handlePrediction(item.prediction)}</Typography>

        <Typography variant="caption" sx={{ color: 'text.disabled' }}>
          {fDateTime(item.date)}
        </Typography>
      </TimelineContent>
    </TimelineItem>
  );
}
