const GithubUser = require('../models/GithubUser');
const { codeExchange, getGithubProfile } = require('../utils/github');

module.exports = class UserService {
  static create(code) {
    let githubProfile;
    return codeExchange(code)
      .then((token) => getGithubProfile(token))
      .then((profile) => {
        githubProfile = { 
          username: profile.login,
          email: profile.email,
          avatar: profile.avatar_url
        };
        return GithubUser.findByUsername(profile.login);
      })
      .then((user) => {
        if (!user) return GithubUser.insert(githubProfile);
        return user;
      });
  }
};
