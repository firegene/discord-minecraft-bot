const Clarifai = require('clarifai');

const app = new Clarifai.App({
  apiKey: process.env.CLARIFAI_API_KEY
});

/**
 * @param embeds A list of image URL's to check
 * @returns {Promise<Number[]>} A promise that will resolve to an array of numbers, one per URL,
 * where each number represents the probability (out of 100) that the image contains nsfw content
 */
module.exports = function getNSFW(embeds){
  let checks = [];
  for(let em of embeds){
    checks.push(app.models.predict(Clarifai.NSFW_MODEL, em).then(r => {
      return r.outputs[0].data.concepts.find(x => x.name === "nsfw").value;
    }));
  }
  return Promise.all(checks);
};
