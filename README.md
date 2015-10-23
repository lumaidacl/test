# Initial layout with Gulp configuration

It is being used for Gulp tasks:
- Development server configuration
- Compile stylus
- Add prefixes for compatibility with different browsers
- JSHint to scan files Javascript
- Minimize HTML, CSS and Javascript files
- Merge CSS and JS files into a single file per type
- Multidevice synchronization client for testing

The configuration of the paths are in the file `config.json`

--------------------------------------------------------------
## Requirements
- NodeJS
- Npm

## How to use?

- Clone the repository
- Install gulp globally: `npm install gulp -g`
- Instal dependencies for the project: `npm install`
- Run server: `gulp server`
- Create production files: `gulp server:deploy`
