import '../jsDomSetup'
import React from 'react'
import { shallow } from 'enzyme';
import "babel-polyfill"

import GameBorder from '../../src/client/containers/gameBoard/gameBorder'

describe('Game border =>', () => {

    test('game border :', () => {
        const component = shallow(
            <GameBorder />
        );

        expect(component).toMatchSnapshot()
    });
}) 