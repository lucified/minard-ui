
# Link types from ./types to node_modules/@types
# This is done for packages without types and for packages
# with outdated type definition files (e.g. all Redux-related libraries).
# The latter problem should be fixed once DefinitelyTyped starts
# publishing to NPM automatically. See: https://github.com/Microsoft/TypeScript/issues/9832

cd node_modules/@types

# TODO: once NPM is updated with latest DefinitelyTyped definitions, remove these

# Redux-related changes copied from https://github.com/DefinitelyTyped/DefinitelyTyped/commit/d417f687ab0c81ed72bffbc5dace5f643369bb70#diff-f8f9f864b333905086c5149ba61d7df4
rm -rf react-redux
ln -s ../../types/react-redux

rm -rf react-router-redux
ln -s ../../types/react-router-redux

rm -rf history
ln -s ../../types/history
