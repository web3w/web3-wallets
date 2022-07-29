# Getting Started with Create React App


GENERATE_SOURCEMAP=false react-scripts   --openssl-legacy-provider start

### For web3.js config

Dependency package Installation  
` npm i stream-http os-browserify https http crypto-browserify stream-browserify `

Modify the webpack config  
`open node_modules/react-scripts/config/webpack.config.js`

```ts
 resolve:{
    fallback: {
        "http": require.resolve("stream-http"),
        "https": require.resolve("https-browserify"),
        "os": require.resolve("os-browserify/browser"),
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "buffer": require.resolve("buffer")
    },
},
 plugins: [
            // Work around for Buffer is undefined:
            // https://github.com/webpack/changelog-v5/issues/10
            new webpack.ProvidePlugin({
                process: "process/browser",
                Buffer: ["buffer", "Buffer"],
            }),
  ]

``
