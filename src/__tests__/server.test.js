/* eslint-env jest */
const request = require('supertest');

const mockOpen = jest.fn();
const mockConfigure = jest.fn(() => ({ open: mockOpen }));

jest.mock('open-in-editor', () => ({
    configure: mockConfigure
}));

jest.mock('fs', () => ({
    existsSync: jest.fn()
}));

let fs;

describe('server', () => {
    let server;

    beforeEach(() => {
        jest.resetModules();
        fs = require('fs');
        mockOpen.mockClear();
        mockConfigure.mockClear();
        fs.existsSync.mockReturnValue(false);
        server = require('../server');
    });

    test('opens file in configured editor', async () => {
        await request(server.app)
            .get('/openeditor')
            .query({ options: 'file.js' });
        expect(mockConfigure).toHaveBeenCalledWith(
            { editor: 'sublime' },
            expect.any(Function)
        );
        expect(mockOpen).toHaveBeenCalledWith('file.js');
    });

    test('updateEditor changes editor', async () => {
        server.updateEditor('atom');
        await request(server.app).get('/openeditor');
        expect(mockConfigure).toHaveBeenLastCalledWith(
            { editor: 'atom' },
            expect.any(Function)
        );
    });

    test('adds vscode command when available', async () => {
        fs.existsSync.mockReturnValue(true);
        server.updateEditor('code');
        await request(server.app).get('/openeditor');
        expect(mockConfigure).toHaveBeenLastCalledWith(
            { editor: 'code', cmd: '/usr/local/bin/code' },
            expect.any(Function)
        );
    });
});
