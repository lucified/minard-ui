
# Link types from ./types to node_modules/@types
# This is done for packages without types and for packages
# with outdated type definition files (e.g. all Redux-related libraries).
# The latter problem should be fixed once DefinitelyTyped starts
# publishing to NPM automatically. See: https://github.com/Microsoft/TypeScript/issues/9832

cd node_modules/@types

# TODO: once NPM is updated with latest DefinitelyTyped definitions, remove these

rm -rf react-redux
ln -s ../../types/react-redux

rm -rf react-router-redux
ln -s ../../types/react-router-redux
