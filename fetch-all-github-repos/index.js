const https = require('https');

const GITHUB_USER = process.env.GITHUB_USER ? process.env.GITHUB_USER : '';
const GITHUB_API_KEY = process.env.GITHUB_API_KEY ? process.env.GITHUB_API_KEY : '';

function fetchReposMetadataJson(host, path) {
  const url = `https://${host}/${path}`;

  const options = {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:73.0) Gecko/20100101 Firefox/73.0',
      'Authorization': `token ${GITHUB_API_KEY}`,
    },
  };

  return new Promise((resolve, reject) => {
    const callback = function (response) {
      if (!response) {
        reject('Error: response is undefined!');
        return;
      }

      if (response.statusCode !== 200) {
        let errStr = '';

        response.on('data', function (chunk) {
          errStr += chunk;
        });

        response.on('end', function () {
          reject(`Got unexpected status code: '${response ? response.statusCode : undefined}'! Details:\n${errStr}`);
        });

        return;
      }

      let dataStr = '';

      response.on('data', function (chunk) {
        dataStr += chunk;
      });

      response.on('end', function () {
        let dataObj;

        try {
          dataObj = JSON.parse(dataStr);
        } catch (err) {
          reject(err);
          return;
        }

        resolve(dataObj);
      });
    };

    https.get(url, options, callback).on('error', reject);
  });
}

function fetchAllRepos(repoType) {
  const repos = [];

  return new Promise((resolve, reject) => {
    function fetchReposByPage(page) {
      fetchReposMetadataJson('api.github.com', `${repoType}/${GITHUB_USER}/repos?page=${page}&per_page=30`).then((data) => {
        if (data.length === 0) {
          resolve(repos);
        } else {
          console.log(`[page ${page}]`);
          console.log(`--------------`);

          // Here `data` is already parsed as JSON. Append to `repos` array.
          repos.push.apply(repos, data.map((repo) => repo.name));
          setTimeout(() => {
            fetchReposByPage(page + 1);
          }, 800 + Math.floor(Math.random() * 400));
        }
      }).catch((error) => {
        if (error.res) {
          console.log('Status: ', error.res.statusCode);
          console.log('Body: ', error.res.body);
        } else if (error.err) {
          console.log('Error: ', error.err);
        } else if (error) {
          console.log(error);
        } else {
          console.log('Unknown error!');
        }

        resolve(repos);
      });
    }

    fetchReposByPage(1);
  });
}

fetchAllRepos('users').then((repos) => {
  console.log('\n-----');
  console.log(`Total repos: ${repos.length}`);
  console.log('-----\n');

  repos.forEach((repo) => {
    console.log(`"${repo}"`);
  });
});
