// babel.config.js
module.exports = api => {
    api.env('test');

    return {
        "presets": [
            [
                "@babel/preset-env"
            ]
        ],
        "plugins": [
            ["@babel/transform-runtime", {
                "regenerator": true
            }]
        ]
    };
};
