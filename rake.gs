//Browserify didn't work. I'm going to try to use node-rake as a guideline to re-code RAKE
//A LOT OF THIS CODE AND ALL IDEAS ARE COPIED FROM node-rake. I am only porting it to work in .gs

function rake(text) {
  const sentenceList = splitTextToSentences(text);
  //Logger.log(sentenceList);
  const phrasesList = generatePhrases(sentenceList);
  //Logger.log(phrasesList);
  const wordScores = calculateKeywordScores(phrasesList);
  //Logger.log(wordScores);
  const phraseScores = calculatePhraseScores(phrasesList, wordScores);
  //Logger.log(phraseScores);
  const result = sortPhrases(phraseScores);
  //Logger.log(result);
  //Logger.log(result[0]);
  return result;
}

function rakeScored(text){
  const sentenceList = splitTextToSentences(text);
  //Logger.log(sentenceList);
  const phrasesList = generatePhrases(sentenceList);
  //Logger.log(phrasesList);
  const wordScores = calculateKeywordScores(phrasesList);
  //Logger.log(wordScores);
  const result = calculatePhraseScores(phrasesList, wordScores);
  //Logger.log(result);
  return result;
}

function weightedrake(pairs){
  let results = {};
  for (let i = 0; i < pairs.length; i++){
    let pair = pairs[i];
    let result = rakeScored(pair[0]);
    for (let [key, value] of Object.entries(result)){
      if (results[key]){
        results[key] += value;
      } else {
        results[key] = value;
      }
    }
  }
  return sortPhrases(results)
}

function splitTextToSentences(text) {
  const sentences = text.match(/[^.!?:\\(),]+/g);//(),
  const filteredSentences = sentences.filter(s => s.replace(/  +/g, '') !== '');
  return filteredSentences;
}

function removeStopWords(sentence) {//Currently not working
  //const r = stopwordsRegex; //hmmm. does this work in google scripts?
      //new RegExp(`\\b(?:${r})\\b`, 'ig');
  const filteredSentence = sentence.replace(stopwordsTrueRegex, '|').split('|');
  return filteredSentence;
}

function generatePhrases(sentenceList) {
  const reg = /['!"“”’#$%&()*+,\-./:;<=>?@[\\\]^_`{|}~']/g;
  const phrases = sentenceList.map(s => removeStopWords(s));
  const phraseList = phrases.map(phrase => phrase
    .filter(phr => (phr.replace(reg, '') !== ' ' && phr.replace(reg, '') !== ''))
    .map(phr => phr.trim(" ,.()"))
  );
  const flattenedList = [].concat(...phraseList);
  return flattenedList;
}

function calculateKeywordScores(phraseList) {
  const wordFreq = {};
  const wordDegree = {};
  const wordScore = {};
  phraseList.forEach((phrase) => {
    const wordList = phrase.match(/[,.!?;:/‘’“”]|\b[0-9a-z']+\b/gi);
    if(wordList){
      const wordListDegree = wordList.length;
      wordList.forEach((word) => {
        if (wordFreq[word]) {
          wordFreq[word] += 1;
        }
        else {
          wordFreq[word] = 1;
        }
        if (wordDegree[word]) {
          wordDegree[word] += wordListDegree;
        }
        else {
          wordDegree[word] = wordListDegree;
        }
      });
    }
  });
  //check if works in google scripts
  Object.values(wordFreq).forEach((freq) => { wordDegree[freq] += wordFreq[freq]; });
  Object.keys(wordFreq).forEach((i) => { wordScore[i] = wordDegree[i] / (wordFreq[i] * 1.0); });
  return wordScore;
}

function calculatePhraseScores(phraseList, wordScore) {
  const phraseScores = {};
  phraseList.forEach((phrase) => {
    phraseScores[phrase] = 0;
    let candidateScore = 0;
    const wordList = phrase.match(/(\b[^\s]+\b)/g);
    wordList.forEach((word) => { candidateScore += wordScore[word]; });
    phraseScores[phrase] = candidateScore;
  });
  return phraseScores;
}

function sortPhrases(obj) {
  return Object.keys(obj).sort((a, b) => obj[b] - obj[a]);
}














