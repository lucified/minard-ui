function getParameterByName(name: string) {
  const url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
  const results = regex.exec(url);
  if (!results) {
    return null;
  }
  if (!results[2]) {
    return '';
  }
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function getTeamId() {
  if (window && getParameterByName('teamId')) {
    return getParameterByName('teamId');
  }
  return process.env.TEAM_ID ? process.env.TEAM_ID : 2;
}

function getTeamName(): string {
  const id = getTeamId();

  switch (id) {
    case 2:
      return 'Test team';
    case 3:
      return 'Lucify';
    case 4:
      return 'HS Data Desk';
    default:
      return 'Unknown team';
  }
}

export const teamId = getTeamId();
export const teamName = getTeamName();
