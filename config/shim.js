// Makes CommonJS incompatible files browserifyable.
// https://github.com/thlorenz/browserify-shim

module.exports = {
    'reveal': {
        exports: 'global:Reveal'
    }
};
