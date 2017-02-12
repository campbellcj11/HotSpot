import reducer from '../app/reducers/user';
import { initialState } from '../app/reducers/user';

it('returns the same state on an unhandled action', () => {
  expect(reducer(initialState, {type: '_NULL'})).toMatchSnapshot();
});
