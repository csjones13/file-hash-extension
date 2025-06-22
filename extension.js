const vscode = require('vscode');
const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');

function activate(context) {
    // Path to JSON file in workspace root
    const getHashFilePath = () => {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        return workspaceFolder ? path.join(workspaceFolder.uri.fsPath, 'fileHashes.json') : null;
    };

    // Load existing hashes from JSON file
    async function loadHashes(hashFilePath) {
        try {
            const data = await fs.readFile(hashFilePath, 'utf8');
            return JSON.parse(data);
        } catch {
            return {};
        }
    }

    // Save hashes to JSON file
    async function saveHashes(hashFilePath, hashes) {
        try {
            await fs.writeFile(hashFilePath, JSON.stringify(hashes, null, 2));
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to save hashes: ${error.message}`);
        }
    }

    // Generate SHA-256 hash of file content
    async function generateHash(filePath) {
        try {
            const content = await fs.readFile(filePath);
            return crypto.createHash('sha256').update(content).digest('hex');
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to hash file ${filePath}: ${error.message}`);
            return null;
        }
    }

    // Register onDidSaveTextDocument event
    const disposable = vscode.workspace.onDidSaveTextDocument(async (document) => {
        const hashFilePath = getHashFilePath();
        if (!hashFilePath) {
            vscode.window.showErrorMessage('No workspace folder found.');
            return;
        }

        const filePath = document.uri.fsPath;
        const relativePath = vscode.workspace.asRelativePath(filePath);
        const hash = await generateHash(filePath);

        if (hash) {
            const hashes = await loadHashes(hashFilePath);
            hashes[relativePath] = {
                hash,
                lastModified: new Date().toISOString()
            };
            await saveHashes(hashFilePath, hashes);
            vscode.window.showInformationMessage(`Hash updated for ${relativePath}`);
        }
    });

    context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};