const path = require('path');


module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry:  {
        'circle': './src/circle.ts',
        'boxes': './src/boxes.ts',
        'fireworks': './src/fireworks.ts',
        'gears': './src/gears.ts',
        'zipper': './src/zipper.ts',
        'clock': './src/clock.ts',
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/dist/'
    },
    devServer: {
        static: {
            directory: path.join(__dirname, '/'),
            publicPath: '/',
        }
    },
};