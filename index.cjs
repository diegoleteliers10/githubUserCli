#!/usr/bin/env node

const username = process.argv[2];

if (!username) {
  console.error("No username provided");
  process.exit(1);
}

const url = `https://api.github.com/users/${username}/events`;

fetch(url)
  .then((response) => response.json())
  .then((data) => {
    const actions = data.map(event => ({ type: event.type, repoName: event.repo.name }));
    const groupedActions = actions.reduce((acc, action) => {
      acc[action.repoName] = acc[action.repoName] || { pushCount: 0, watchCount: 0, createCount: 0 };
      if (action.type === 'PushEvent') acc[action.repoName].pushCount++;
      if (action.type === 'WatchEvent') acc[action.repoName].watchCount++;
      if (action.type === 'CreateEvent') acc[action.repoName].createCount++;
      return acc;
    }, {});

    // Formatear el output
    Object.entries(groupedActions).forEach(([repoName, counts]) => {
      if (counts.pushCount > 0) {
        console.log(`Push ${counts.pushCount} commits to ${repoName}`);
      }
      if (counts.watchCount > 0) {
        console.log(`Starred ${repoName}`);
      }
      if (counts.createCount > 0) {
        console.log(`Create a new repo ${repoName}`);
      }
    });
  })
  .catch((error) => {
    console.error(error);
  });