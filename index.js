// @ts-check

const getTerms = (text) => text.match(/\w+/g);
const getWords = (text) => text.split(' ');;
const getAllWords = (text) => [...getWords(text), ...getTerms(text)]
const findItem = word => item => item === word;

const relevantSort = (word) => (doc1, doc2) => {
    const words1 = getAllWords(doc1.text).filter(findItem(word));
    const words2 = getAllWords(doc2.text).filter(findItem(word));
    return words2.length - words1.length;
};

export default (docs) => {

    const search = (word) => {
        return docs
            .filter(({text}) => {
                const findWord = findItem(word)
                const terms = getTerms(text);
                const words = getWords(text);
                return words.find(findWord) ?? terms.find(findWord);
            })
            .sort(relevantSort(word))
            .map(doc => doc.id);
    }
    return {search};
};
