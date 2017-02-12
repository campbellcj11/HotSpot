import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import ImageButton, { styles } from '../app/components/ImageButton';
import filterImage from '../app/images/filter.png'

const testWidth = 32;
const testHeight = 32;

it('renders a ImageButton using Snapshots', () => {
  expect(renderer.create(
      <ImageButton image={filterImage} style={{width:testWidth,height:testHeight}} imageStyle={{width:18,height:18,tintColor:'white'}}>
      </ImageButton>
  )).toMatchSnapshot();
});
