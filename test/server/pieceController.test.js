import Pieces, { pieceGenerator } from '../../src/server/controllers/piecesController';

    // pieceGenerator
describe('PieceGenerator =>', () => {
    test('pieceGenerator', () => {
        expect(pieceGenerator()).toMatchObject({
            piece: expect.any(Array),
            x: expect.any(Number),
            y: expect.any(Number),
          });
    });

    test('piecesPackGenerator', () => {
        expect(Pieces.piecesPackGenerator()).toHaveLength(50);
    });
});