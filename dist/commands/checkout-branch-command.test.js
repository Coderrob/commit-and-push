import * as core from '@actions/core';
import { CheckoutBranchCommand } from './checkout-branch-command';
describe('CheckoutBranchCommand', () => {
    it('should set git, branch, and createBranch properties', () => {
        const mockGit = {};
        const branch = 'feature/test';
        const createBranch = true;
        const command = new CheckoutBranchCommand(mockGit, branch, createBranch);
        // @ts-expect-error: testing private properties
        expect(command.git).toBe(mockGit);
        // @ts-expect-error: testing private properties
        expect(command.branch).toBe(branch);
        // @ts-expect-error: testing private properties
        expect(command.createBranch).toBe(createBranch);
    });
    it('should call core.info and git.checkoutBranch with correct arguments when execute is called', async () => {
        const mockGit = {
            checkoutBranch: jest.fn().mockResolvedValue(undefined)
        };
        const branch = 'feature/test';
        const createBranch = false;
        const command = new CheckoutBranchCommand(mockGit, branch, createBranch);
        const coreInfoSpy = jest.spyOn(core, 'info').mockImplementation(() => { });
        await command.execute();
        expect(coreInfoSpy).toHaveBeenCalledWith('Checking out branch...');
        expect(mockGit.checkoutBranch).toHaveBeenCalledWith(branch, createBranch);
        coreInfoSpy.mockRestore();
    });
    it('should propagate errors thrown by git.checkoutBranch', async () => {
        const error = new Error('checkout failed');
        const mockGit = {
            checkoutBranch: jest.fn().mockRejectedValue(error)
        };
        const command = new CheckoutBranchCommand(mockGit, 'branch', false);
        jest.spyOn(core, 'info').mockImplementation(() => { });
        await expect(command.execute()).rejects.toThrow('checkout failed');
    });
});
//# sourceMappingURL=checkout-branch-command.test.js.map