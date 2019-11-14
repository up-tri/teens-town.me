module.exports = ({ env }) => {
    console.log('postcss: ', env)
    const isDev = env === 'development'

    return {
        plugins: {
            autoprefixer: {},
            cssnano: {
                discardEmpty: true,
                discardDuplicates: true,
                colormin: true,
                discardComments: { removeAll: true },
            },
        },
    }
}
