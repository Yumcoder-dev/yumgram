This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

vscode config:

```json
{
  "workbench.colorTheme": "Visual Studio Dark",
  "window.zoomLevel": 0,
  "editor.formatOnPaste": true,
  "editor.formatOnSave": true,
  "eslint.autoFixOnSave": true,
  "eslint.packageManager": "yarn",
  "editor.fontLigatures": true,
  "workbench.editor.highlightModifiedTabs": true,
  "files.autoSave": "afterDelay",
  "javascript.format.enable": false,
  "prettier.eslintIntegration": true,
  "editor.fontWeight": "500",
  "explorer.sortOrder": "type",
  "editor.cursorStyle": "block",
  "editor.cursorBlinking": "smooth",
  "files.trimFinalNewlines": true,
  "editor.acceptSuggestionOnEnter": "smart",
  "emmet.triggerExpansionOnTab": false,
  "javascript.updateImportsOnFileMove.enabled": "always",
  "editor.fontSize": 16,
  "terminal.integrated.fontSize": 16,
  "markdown.preview.fontSize": 16,
  "editor.rulers": [100],
  "eslint.alwaysShowStatus": true,
  "files.exclude": {
    "/node_modules": true
  },
  "search.exclude": {
    "/build": true,
    "/jquery*": true,
    "/node_modules": true,
    "**/bower_components": true
  },
  "javascript.suggest.autoImports": true,
  "prettier.stylelintIntegration": true,
  "stylelint.enable": true,
  "css.validate": false,
  "less.validate": false,
  "scss.validate": false,
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "psi-header.config": {
    "forceToTop": true,
    "blankLinesAfter": 1
  },
  "psi-header.templates": [
    {
      "language": "*",
      "template": [
        "Copyright (c) 2019-present, The Yumcoder Authors. All rights reserved.",
        "",
        "This source code is licensed under the license found in the LICENSE file in",
        "the root directory of this source tree."
      ]
    }
  ]
}
```

development enviroment:

- [vscode](https://code.visualstudio.com/) is the primary development ide
- eslint (dbaeumer.vscode-eslint) plug-in is enabled
- [entd](https://ant.design) for ui components

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
