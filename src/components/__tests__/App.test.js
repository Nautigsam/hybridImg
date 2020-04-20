import React from 'react';
import { StaticRouter } from 'react-router-dom';

import { App } from '../App';

import { shallow } from 'enzyme';

describe('App', () => {
  it('renders correctly', () => {
    const wrapper = shallow(
      <StaticRouter>
        <App initialData={{ appName: 'TEST' }} />
      </StaticRouter>
    );

    expect(wrapper).toMatchSnapshot();
  });
});
