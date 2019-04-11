import '../jsDomSetup'
import React from 'react'
import { shallow } from 'enzyme';
import "babel-polyfill"

import Dashboard from '../../src/client/containers/dashboard/dashboard'


describe('Dashboard =>', () => {

    test('dashboard :', () => {
        const component = shallow(
                <Dashboard />
        );

        expect(component).toMatchSnapshot()
    });
}) 