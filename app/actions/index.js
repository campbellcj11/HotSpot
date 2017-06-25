import * as EventsActions from './events';
import * as UserActions from './user';
import * as AppActions from './app';

export const ActionCreators = Object.assign({},
  EventsActions,
  UserActions,
  AppActions,
);
