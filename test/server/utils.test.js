import { getUrlMatch, gotToLogin } from '../../src/server/utils/utils'

    // getUrlMatch
describe('Utils => getUrlMatch', () => {
    test('getUrlMatch : matches', () => {
        const hash = '#Jean[Jean]'
        expect(getUrlMatch(hash)).toEqual(expect.arrayContaining(['#Jean[Jean]', 'Jean', 'Jean']));
    });
    test('getUrlMatch : no matches', () => {
        const hash = 'Jean[Jean]'
        expect(getUrlMatch(hash)).toBeNull();
    });
    test('getUrlMatch : no matches', () => {
        const hash = '#JeanJean]'
        expect(getUrlMatch(hash)).toBeNull();
    });
    test('getUrlMatch : no matches', () => {
        const hash = '#Jean-Jean'
        expect(getUrlMatch(hash)).toBeNull();
    });
});

describe('Utils => gotToLogin', () => {
    test('gotToLogin : matches', () => {
        const gameUrl = 'http://localhost:3000/#RoomJean[Jean]'
        expect(gotToLogin(gameUrl)).toEqual({ userName: 'Jean', roomName: 'RoomJean' });
    });
    test('gotToLogin : no matches', () => {
        const gameUrl = 'http://localhost:3000/#RoomJean[Jean]yfiuyfco'
        expect(gotToLogin(gameUrl)).toEqual({ userName: 'Jean', roomName: 'RoomJean' });
    });
    test('gotToLogin : no matches', () => {
        const gameUrl = 'http://localhost:3000/#RoomJeanJean]yfiuyfco'
        expect(gotToLogin(gameUrl)).toEqual({ userName: null, roomName: null });
    });
    test('gotToLogin : no matches', () => {
        const gameUrl = 'http://localhost:3000/RoomJean[Jean]'
        expect(gotToLogin(gameUrl)).toEqual({ userName: null, roomName: null });
    });
});