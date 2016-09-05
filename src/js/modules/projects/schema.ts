const yup = require('yup');

export default (existingProjects: string[]) =>
  yup.object().shape({
    name: yup.string()
      .required('Required')
      .matches(/^[a-z0-9\-]+$/, 'Only lower-case letters, numbers, and dashes allowed')
      .notOneOf(existingProjects, 'Project name already exists'),
    description: yup.string()
      .max(2000, 'The description can be up to 2000 characters long'),
  });
