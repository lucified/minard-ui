import * as React from 'react';
import { connect } from 'react-redux';

import { FetchError } from '../../modules/errors';
import Previews, { Preview } from '../../modules/previews';
import { StateTree } from '../../reducers';

interface PassedProps {
  location: any;
  route: any;
  params: any;
}

interface GeneratedStateProps {
  preview?: Preview | FetchError;
}

interface GeneratedDispatchProps {
  loadPreview: (deploymentId: string) => void;
}

type Props = PassedProps & GeneratedStateProps & GeneratedDispatchProps;

class ProjectsFrame extends React.Component<Props, any> {
  public componentWillMount() {
    const { loadPreview } = this.props;
    const { deploymentId } = this.props.params;

    loadPreview(deploymentId);
  }

  public componentWillReceiveProps(nextProps: Props) {
    const { loadPreview } = nextProps;
    const { deploymentId } = nextProps.params;

    if (deploymentId !== this.props.params.deploymentId) {
      loadPreview(deploymentId);
    }
  }

  public render() {
    const { deploymentId } = this.props.params;

    return (
      <div>
        {deploymentId}
      </div>
    );
  }
};

const mapStateToProps = (state: StateTree, ownProps: PassedProps): GeneratedStateProps => {
  const { deploymentId } = ownProps.params;
  return {
    preview: Previews.selectors.getPreview(state, deploymentId),
  };
};

export default connect<GeneratedStateProps, GeneratedDispatchProps, PassedProps>(
  mapStateToProps,
  { loadPreview: Previews.actions.loadPreview },
)(ProjectsFrame);
