# file-hash-extension
VSCode File Hash Extension that will create a JSON file with file hashes on save of files. Used for discrete cache busting and management

### Run Commands
`npm install -g vsce`
`vsce package`

## Install

### Install the Extension:
- In any VSCode window, go to Extensions (Ctrl+Shift+X), click ... > Install from VSIX, and select the .vsix file.
- The extension will now be active in all VSCode instances.
### Use with Web Apps:
- Open my-web-app or my-project-root as your workspace.
- Save files, and fileHashes.json will be generated in the workspace root.
