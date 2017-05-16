// tslint:disable:no-object-literal-type-assertion

describe('Previews sagas', () => {
  // const api = createApi();
  // const sagaFunctions = createSagas(api).functions;

  describe('loadPreview', () => {
    it('fetches preview if it is missing');
    it('does not fetch preview if it already exists');
  });

  describe('fetchPreview', () => {
    it('sends a request started action');
    it('fetches the preview');
    it('converts and stores the included commit');
    it('converts and stores the included deployment');
    it('stores the preview');
    it('converts and stores the included commit');
    it('sends a request completed action once finished');
    it('sends a request failed action if an error occurs');
  });

  describe('loadPreviewAndComments', () => {
    it('TODO');
  });

  describe('loadCommentsForDeployment', () => {
    it('TODO');
  });

  describe('fetchCommentsForDeployment', () => {
    it('TODO');
  });
});
