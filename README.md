# Yumgram
**Yumgram** is unofficial telegram [**react**](https://reactjs.org) web app. It is based on the MTProto protocol and has an Open API.

That said, I'm using this app myself and I'd like to share its sources, so anyone can contribute to the development. Any help is welcome!

## Technical details

The app is based on the [**react**](https://reactjs.org) framework, and it was bootstrapped with [create react app](https://github.com/facebook/create-react-app). UI components are developed based on [antd](https://ant.design). The [vscode](https://code.visualstudio.com/) is the primary development IDE with [airbnb eslint](https://github.com/airbnb/javascript) config.

### `Design framework`

Simplicity and minimalism are the core design principle . Every react component manage by a controller based on [pipe hook](./src/js/README.md)
In the project directory, you can run the app:

```(shell)
> git clone https://github.com/YumcoderCom/yumgram
> cd yumgram
> npm start
```

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `run tests and storybooks`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

```(shell)
> cd yumgram
> npm run test
```

[**Storybook**](https://storybook.js.org/) is a user interface development environment and playground for UI components. The tool enables developers to create components independently and showcase components interactively in an isolated development environment. Start Storybook with:

```(shell)
> cd yumgram
> npm run storybook
```

### `build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

```(shell)
> cd yumgram
> npm run build
```

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
