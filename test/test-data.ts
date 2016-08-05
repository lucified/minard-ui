import { ApiResponse } from '../src/js/api/types';

export const projectsResponse: ApiResponse = {
  'data': [
    {
      'type': 'projects',
      'id': '1',
      'attributes': {
        'name': 'First project',
        'description': 'This is the first project description. It might not be set.',
        'activeCommiters': ['ville.saarinen@lucify.com', 'juho@lucify.com'],
      },
      'relationships': {
        'branches': {
          'data': [{
            'type': 'branches',
            'id': '1',
          },
          {
            'type': 'branches',
            'id': '2',
          },
          {
            'type': 'branches',
            'id': '3',
          }],
        },
      },
    },
    {
      'type': 'projects',
      'id': '2',
      'attributes': {
        'name': 'Second project',
        'activeCommiters': <string[]> [],
      },
      'relationships': {
        'branches': {
          'data': <string[]> [],
        },
      },
    },
  ],
  'included': [
    {
      'type': 'branches',
      'id': '1',
      'attributes': {
        'name': 'first-branch',
        'description': 'This is a branch description',
      },
      'relationships': {
        'deployments': {
          'data': [{
            'type': 'deployments',
            'id': '7',
          }],
        },
        'commits': {
          'data': [{
            'type': 'commits',
            'id': 'aacceeff02',
          },
          {
            'type': 'commits',
            'id': '12354124',
          },
          {
            'type': 'commits',
            'id': '2543452',
          },
          {
            'type': 'commits',
            'id': '098325343',
          },
          {
            'type': 'commits',
            'id': '29832572fc1',
          },
          {
            'type': 'commits',
            'id': '29752a385',
          }],
        },
        'project': {
          'data': {
            'type': 'projects',
            'id': '1',
          },
        },
      },
    },
    {
      'type': 'branches',
      'id': '2',
      'attributes': {
        'name': 'second-branch',
      },
      'relationships': {
        'commits': {
          'data': [{
            'type': 'commits',
            'id': 'aacd00f02',
          },
          {
            'type': 'commits',
            'id': 'a998823423',
          }],
        },
        'deployments': {
          'data': [{
            'type': 'deployments',
            'id': '8',
          }],
        },
        'project': {
          'data': {
            'type': 'projects',
            'id': '1',
          },
        },
      },
    },
    {
      'type': 'branches',
      'id': '3',
      'attributes': {
        'name': 'third-long-name-branch',
      },
      'relationships': {
        'commits': {
          'data': [],
        },
        'deployments': {
          'data': [],
        },
        'project': {
          'data': {
            'type': 'projects',
            'id': '1',
          },
        },
      },
    },
  ],
};

export const projectsResponseNoInclude: ApiResponse = {
  'data': [
    {
      'type': 'projects',
      'id': '1',
      'attributes': {
        'name': 'First project',
        'description': 'This is the first project description. It might not be set.',
        'activeCommiters': ['ville.saarinen@lucify.com', 'juho@lucify.com'],
      },
      'relationships': {
        'branches': {
          'data': [{
            'type': 'branches',
            'id': '1',
          },
          {
            'type': 'branches',
            'id': '2',
          },
          {
            'type': 'branches',
            'id': '3',
          }],
        },
      },
    },
    {
      'type': 'projects',
      'id': '2',
      'attributes': {
        'name': 'Second project',
        'activeCommiters': <string[]> [],
      },
      'relationships': {
        'branches': {
          'data': <string[]> [],
        },
      },
    },
  ],
};

export const deploymentResponseNoInclude: ApiResponse = {
  'data': {
    'type': 'deployments',
    'id': '7',
    'attributes': {
      'url': '#',
      'screenshot': '#',
      'creator': {
        'name': 'Ville Saarinen',
        'email': 'ville.saarinen@lucify.com',
        'timestamp': '2016-08-02T09:51:21.802Z',
      },
    },
    'relationships': {
      'commit': {
        'data': {
          'type': 'commits',
          'id': 'aacceeff02',
        },
      },
    },
  },
};

export const deploymentResponse: ApiResponse = {
  'data': {
    'type': 'deployments',
    'id': '7',
    'attributes': {
      'url': '#',
      'screenshot': '#',
      'creator': {
        'name': 'Ville Saarinen',
        'email': 'ville.saarinen@lucify.com',
        'timestamp': '2016-08-02T09:51:21.802Z',
      },
    },
    'relationships': {
      'commit': {
        'data': {
          'type': 'commits',
          'id': 'aacceeff02',
        },
      },
    },
  },
  'included': [
    {
      'type': 'commits',
      'id': 'aacceeff02',
      'attributes': {
        'author': {
          'name': 'Ville Saarinen',
          'email': 'ville.saarinen@lucify.com',
          'timestamp': '2016-08-01T15:51:21.802Z',
        },
        'commiter': {
          'email': 'juho@lucify.com',
          'timestamp': '2016-07-29T13:51:21.802Z',
        },
        'message': 'Fix colors',
        'description': "The previous colors didn't look nice. Now they're much prettier.",
      },
      'relationships': {
        'deployments': {
          'data': [{
            'type': 'deployments',
            'id': '7',
          }],
        },
        'branch': {
          'data': {
            'type': 'branches',
            'id': '1',
          },
        },
      },
    },
  ],
};

export const branchResponseNoInclude: ApiResponse = {
  'data': {
    'type': 'branches',
    'id': '1',
    'attributes': {
      'name': 'first-branch',
      'description': 'This is a branch description',
    },
    'relationships': {
      'deployments': {
        'data': [{
          'type': 'deployments',
          'id': '7',
        }],
      },
      'commits': {
        'data': [{
          'type': 'commits',
          'id': 'aacceeff02',
        },
        {
          'type': 'commits',
          'id': '12354124',
        },
        {
          'type': 'commits',
          'id': '2543452',
        },
        {
          'type': 'commits',
          'id': '098325343',
        },
        {
          'type': 'commits',
          'id': '29832572fc1',
        },
        {
          'type': 'commits',
          'id': '29752a385',
        }],
      },
      'project': {
        'data': {
          'type': 'projects',
          'id': '1',
        },
      },
    },
  },
};

export const branchResponse: ApiResponse = {
  'data': {
    'type': 'branches',
    'id': '1',
    'attributes': {
      'name': 'first-branch',
      'description': 'This is a branch description',
    },
  },
  'included': [
    {
      'type': 'commits',
      'id': 'aacceeff02',
      'attributes': {
        'author': {
          'name': 'Ville Saarinen',
          'email': 'ville.saarinen@lucify.com',
          'timestamp': '2016-08-01T15:51:21.802Z',
        },
        'commiter': {
          'email': 'juho@lucify.com',
          'timestamp': '2016-07-29T13:51:21.802Z',
        },
        'message': 'Fix colors',
        'description': "The previous colors didn't look nice. Now they're much prettier.",
      },
      'relationships': {
        'deployments': {
          'data': [{
            'type': 'deployments',
            'id': '7',
          }],
        },
        'branch': {
          'data': {
            'type': 'branches',
            'id': '1',
          },
        },
      },
    },
    {
      'type': 'deployments',
      'id': '7',
      'attributes': {
        'url': '#',
        'screenshot': '#',
        'creator': {
          'name': 'Ville Saarinen',
          'email': 'ville.saarinen@lucify.com',
          'timestamp': '2016-08-02T09:51:21.802Z',
        },
      },
      'relationships': {
        'commit': {
          'data': {
            'type': 'commits',
            'id': 'aacceeff02',
          },
        },
      },
    },
  ],
};

export const projectResponseNoInclude: ApiResponse = {
  'data': {
    'type': 'projects',
    'id': '1',
    'attributes': {
      'name': 'First project',
      'description': 'This is the first project description. It might not be set.',
      'activeCommiters': ['ville.saarinen@lucify.com', 'juho@lucify.com'],
    },
    'relationships': {
      'branches': {
        'data': [{
          'type': 'branches',
          'id': '1',
        },
        {
          'type': 'branches',
          'id': '2',
        },
        {
          'type': 'branches',
          'id': '3',
        }],
      },
    },
  },
};

export const projectResponse: ApiResponse = {
  'data': {
    'type': 'projects',
    'id': '1',
    'attributes': {
      'name': 'First project',
      'description': 'This is the first project description. It might not be set.',
      'activeCommiters': ['ville.saarinen@lucify.com', 'juho@lucify.com'],
    },
    'relationships': {
      'branches': {
        'data': [{
          'type': 'branches',
          'id': '1',
        },
        {
          'type': 'branches',
          'id': '2',
        },
        {
          'type': 'branches',
          'id': '3',
        }],
      },
    },
  },
  'included': [
    {
      'type': 'branches',
      'id': '1',
      'attributes': {
        'name': 'first-branch',
        'description': 'This is a branch description',
      },
      'relationships': {
        'deployments': {
          'data': [{
            'type': 'deployments',
            'id': '7',
          }],
        },
        'commits': {
          'data': [{
            'type': 'commits',
            'id': 'aacceeff02',
          },
          {
            'type': 'commits',
            'id': '12354124',
          },
          {
            'type': 'commits',
            'id': '2543452',
          },
          {
            'type': 'commits',
            'id': '098325343',
          },
          {
            'type': 'commits',
            'id': '29832572fc1',
          },
          {
            'type': 'commits',
            'id': '29752a385',
          }],
        },
        'project': {
          'data': {
            'type': 'projects',
            'id': '1',
          },
        },
      },
    },
    {
      'type': 'branches',
      'id': '2',
      'attributes': {
        'name': 'second-branch',
      },
      'relationships': {
        'commits': {
          'data': [{
            'type': 'commits',
            'id': 'aacd00f02',
          },
          {
            'type': 'commits',
            'id': 'a998823423',
          }],
        },
        'deployments': {
          'data': [{
            'type': 'deployments',
            'id': '8',
          }],
        },
        'project': {
          'data': {
            'type': 'projects',
            'id': '1',
          },
        },
      },
    },
    {
      'type': 'branches',
      'id': '3',
      'attributes': {
        'name': 'third-long-name-branch',
      },
      'relationships': {
        'commits': {
          'data': [],
        },
        'deployments': {
          'data': [],
        },
        'project': {
          'data': {
            'type': 'projects',
            'id': '1',
          },
        },
      },
    },
  ],
};

export const commitResponse: ApiResponse = {
  'data': {
    'type': 'commits',
    'id': 'aacceeff02',
    'attributes': {
      'hash': '0123456789abcdef',
      'author': {
        'name': 'Ville Saarinen',
        'email': 'ville.saarinen@lucify.com',
        'timestamp': '2016-08-01T15:51:21.802Z',
      },
      'commiter': {
        'email': 'juho@lucify.com',
        'timestamp': '2016-07-29T13:51:21.802Z',
      },
      'message': "Fix colors\n\nThe previous colors didn't look nice. Now they're much prettier.",
    },
    'relationships': {
      'deployments': {
        'data': [{
          'type': 'deployments',
          'id': '7',
        }],
      },
      'branch': {
        'data': {
          'type': 'branches',
          'id': '1',
        },
      },
    },
  },
  'included': [
    {
      'type': 'commits',
      'id': '12354124',
      'attributes': {
        'hash': '0123456789abcdef',
        'author': {
          'name': 'Ville Saarinen',
          'email': 'ville.saarinen@lucify.com',
          'timestamp': '2016-08-01T15:41:21.802Z',
        },
        'commiter': {
          'name': 'Ville Saarinen',
          'email': 'ville.saarinen@lucify.com',
          'timestamp': '2016-08-01T15:41:21.802Z',
        },
        'message': 'Foobar is nice',
      },
      'relationships': {
        'deployments': {
          'data': <any[]> [],
        },
        'branch': {
          'data': {
            'type': 'branches',
            'id': '1',
          },
        },
      },
    },
    {
      'type': 'commits',
      'id': '2543452',
      'attributes': {
        'hash': '0123456789abcdef',
        'author': {
          'email': 'juho@lucify.com',
          'timestamp': '2016-08-01T12:51:21.802Z',
        },
        'commiter': {
          'email': 'juho@lucify.com',
          'timestamp': '2016-08-01T12:51:21.802Z',
        },
        'message': 'Barbar barr barb aearr',
      },
      'relationships': {
        'deployments': {
          'data': [],
        },
        'branch': {
          'data': {
            'type': 'branches',
            'id': '1',
          },
        },
      },
    },
    {
      'type': 'commits',
      'id': '098325343',
      'attributes': {
        'hash': '0123456789abcdef',
        'author': {
          'name': 'Ville Saarinen',
          'email': 'ville.saarinen@lucify.com',
          'timestamp': '2016-07-29T15:51:21.802Z',
        },
        'commiter': {
          'name': 'Ville Saarinen',
          'email': 'ville.saarinen@lucify.com',
          'timestamp': '2016-07-29T15:51:21.802Z',
        },
        'message': 'This is a commit message',
      },
      'relationships': {
        'deployments': {
          'data': [],
        },
        'branch': {
          'data': {
            'type': 'branches',
            'id': '1',
          },
        },
      },
    },
    {
      'type': 'commits',
      'id': '29832572fc1',
      'attributes': {
        'hash': '0123456789abcdef',
        'author': {
          'email': 'juho@lucify.com',
          'timestamp': '2016-07-29T15:50:21.802Z',
        },
        'commiter': {
          'email': 'juho@lucify.com',
          'timestamp': '2016-07-29T15:50:21.802Z',
        },
        'message': 'And this is one as well',
      },
      'relationships': {
        'deployments': {
          'data': [],
        },
        'branch': {
          'data': {
            'type': 'branches',
            'id': '1',
          },
        },
      },
    },
    {
      'type': 'commits',
      'id': '29752a385',
      'attributes': {
        'hash': '0123456789abcdef',
        'author': {
          'name': 'Ville Saarinen',
          'email': 'ville.saarinen@lucify.com',
          'timestamp': '2016-07-28T15:51:21.802Z',
        },
        'commiter': {
          'name': 'Ville Saarinen',
          'email': 'ville.saarinen@lucify.com',
          'timestamp': '2016-07-28T15:51:21.802Z',
        },
        'message': 'How about this?',
      },
      'relationships': {
        'deployments': {
          'data': [],
        },
        'branch': {
          'data': {
            'type': 'branches',
            'id': '1',
          },
        },
      },
    },
    {
      'type': 'deployments',
      'id': '7',
      'attributes': {
        'url': '#',
        'screenshot': '#',
        'creator': {
          'name': 'Ville Saarinen',
          'email': 'ville.saarinen@lucify.com',
          'timestamp': '2016-08-02T09:51:21.802Z',
        },
      },
      'relationships': {
        'commit': {
          'data': {
            'type': 'commits',
            'id': 'aacceeff02',
          },
        },
      },
    },
    {
      'type': 'commits',
      'id': 'aacd00f02',
      'attributes': {
        'hash': '0123456789abcdef',
        'author': {
          'name': 'Ville Saarinen',
          'email': 'ville.saarinen@lucify.com',
          'timestamp': '2016-07-28T13:51:21.802Z',
        },
        'commiter': {
          'email': 'juho@lucify.com',
          'timestamp': '2016-07-29T13:51:21.802Z',
        },
        'message': 'Try to do something else',
      },
      'relationships': {
        'deployments': {
          'data': <any[]> [],
        },
        'branch': {
          'data': {
            'type': 'branches',
            'id': '2',
          },
        },
      },
    },
    {
      'type': 'commits',
      'id': 'a998823423',
      'attributes': {
        'hash': '0123456789abcdef',
        'author': {
          'email': 'juho@lucify.com',
          'timestamp': '2016-07-27T15:51:21.802Z',
        },
        'commiter': {
          'email': 'juho@lucify.com',
          'timestamp': '2016-07-27T15:51:21.802Z',
        },
        'message': 'Try to do something\n\nThis is a longer commit explanation for whatever was done to the commit. It should be truncated in some cases',
      },
      'relationships': {
        'deployments': {
          'data': [{
            'type': 'deployments',
            'id': '8',
          }],
        },
        'branch': {
          'data': {
            'type': 'branches',
            'id': '2',
          },
        },
      },
    },
    {
      'type': 'deployments',
      'id': '8',
      'attributes': {
        'url': '#',
        'screenshot': '#',
        'creator': {
          'name': 'Ville Saarinen',
          'email': 'ville.saarinen@lucify.com',
          'timestamp': '2016-08-01T09:51:21.802Z',
        },
      },
      'relationships': {
        'commit': {
          'data': {
            'type': 'commits',
            'id': 'a998823423',
          },
        },
      },
    },
  ],
};

export const commitResponseNoInclude: ApiResponse = {
  'data': {
    'type': 'commits',
    'id': 'aacceeff02',
    'attributes': {
      'hash': '0123456789abcdef',
      'author': {
        'name': 'Ville Saarinen',
        'email': 'ville.saarinen@lucify.com',
        'timestamp': '2016-08-01T15:51:21.802Z',
      },
      'commiter': {
        'email': 'juho@lucify.com',
        'timestamp': '2016-07-29T13:51:21.802Z',
      },
      'message': "Fix colors\n\nThe previous colors didn't look nice. Now they're much prettier.",
    },
    'relationships': {
      'deployments': {
        'data': [{
          'type': 'deployments',
          'id': '7',
        }],
      },
      'branch': {
        'data': {
          'type': 'branches',
          'id': '1',
        },
      },
    },
  }
};
