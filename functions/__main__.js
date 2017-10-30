const getTweets = require('../src/getTweets');
const markov = require('../src/markov');

/**
* @param {array} users
* @returns {any}
*/
module.exports = (users, context, callback) => {
  generator = new markov.Generator(2, 30);

  let feedPromises = users.map(user => {
    return getTweets(user)
      .then(tweets => {
        return tweets;
      })
      .catch(error => {
        callback(new Error(`Could not fetch ${user}\'s tweets`));
      });
  });

  Promise.all(feedPromises)
    .then(feeds => {
      feeds.map(feed => {
        feed.map(tweet => {
          generator.feed(tweet);
        });
      });
      let markovTweets = [];
      for (let i = 0; i < 20; i++) {
        markovTweets.push(generator.generate());
      }
      return callback(null, markovTweets);
    })
    .catch(error => {
      return callback(error);
    });
};
