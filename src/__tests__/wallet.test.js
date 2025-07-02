import WalletController from '../controller/wallet.controller.js';
import WalletService from '../service/wallet.service.js';
import { responseHandler } from '../util/index.js';
import { jest } from '@jest/globals'

jest.mock('../service/wallet.service.js');
jest.mock('../util/index.js');

describe('creditWallet Controller', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should successfully credit wallet', async () => {
        const mockReq = {
            body: {
                balance: 1000,
                receiver: '686500a17cff8c5083f1f36d'
            },
            user: {
                userId: '686500a17cff8c5083f1f36d'
            }
        };
        const mockRes = {};

        WalletService.createWallet.mockResolvedValue();
        responseHandler.mockReturnValue('success');

        const result = await creditWallet(mockReq, mockRes);

        expect(WalletService.createWallet).toHaveBeenCalledWith(
            'testUserId',
            1000,
            'user123'
        );

        expect(responseHandler).toHaveBeenCalledWith(
            mockRes,
            true,
            201,
            'Wallet credited successfully',
            null
        );

        expect(result).toBe('success');
    });

});
