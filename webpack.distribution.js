const path = require("path");

const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin"); 

module.exports = {
    entry:{
        app : './src/main.js'
    },
    output:{
        filename : 'main.js',
        path : path.resolve(__dirname,'dist'),
    },
    mode : 'production',
    plugins:[
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets:false
        }),
        new CopyPlugin({
            patterns:[
                {
                    from: 'index.html',
                    context : 'src/'
                },
                {
                    from:'assets/*',
                    context: 'src/'
                }
            ]
        })
    ],
}