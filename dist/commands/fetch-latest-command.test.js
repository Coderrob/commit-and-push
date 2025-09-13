import * as core from '@actions/core';
import { FetchLatestCommand } from './fetch-latest-command';
describe('FetchLatestCommand', () => {
    let gitMock;
    let infoSpy;
    beforeEach(() => {
        gitMock = {
            fetchLatest: jest.fn().mockResolvedValue(undefined)
        };
        infoSpy = jest.spyOn(core, 'info').mockImplementation(() => { });
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
    it('calls core.info with "Fetching latest..."', async () => {
        await new FetchLatestCommand(gitMock).execute();
        expect(infoSpy).toHaveBeenCalledWith('Fetching latest...');
    });
    it('calls git.fetchLatest', async () => {
        await new FetchLatestCommand(gitMock).execute();
        expect(gitMock.fetchLatest).toHaveBeenCalledTimes(1);
    });
    it('propagates errors from git.fetchLatest', async () => {
        const error = new Error('fetch failed');
        gitMock.fetchLatest.mockRejectedValueOnce(error);
        await expect(new FetchLatestCommand(gitMock).execute()).rejects.toThrow(error);
    });
});
//# sourceMappingURL=fetch-latest-command.test.js.map