import * as EventsActions from './events';
import * as UserActions from './user';

export const ActionCreators = Object.assign({},
  EventsActions,
  UserActions,
);
