import { ModelTypes } from './core/ModelTypes';

import type { WorkspacesPopoverProps } from './components/workspaces-popover';

// ----------------------------------------------------------------------

export const _workspaces: WorkspacesPopoverProps['data'] = [
  {
    id: ModelTypes.LinearRegression.nameToSend,
    name: ModelTypes.LinearRegression.nameToDisplay,
    plan: '29%',
    logo: '/assets/icons/workspaces/math-format-linear-svgrepo-com.svg',
  },
  {
    id: ModelTypes.RandomForest.nameToSend,
    name: ModelTypes.RandomForest.nameToDisplay,
    plan: '52%',
    logo: '/assets/icons/workspaces/forest-svgrepo-com.svg',
  },
  {
    id: ModelTypes.SVMBinary.nameToSend,
    name: ModelTypes.SVMBinary.nameToDisplay,
    plan: '76%',
    logo: '/assets/icons/workspaces/crown-user-svgrepo-com.svg',
  },
  {
    id: ModelTypes.SVMMulti.nameToSend,
    name: ModelTypes.SVMMulti.nameToDisplay,
    plan: '76%',
    logo: '/assets/icons/workspaces/crown-user-svgrepo-com.svg',
  },
];
