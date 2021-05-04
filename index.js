// @ts-check

const getTerms = (text) => text.match(/\w+/g);

const getFuzzySearch = (doc, query) => {
    const terms = getTerms(doc.text);
    const queryTerms = getTerms(query);
    const result = terms.reduce((acc, item) => {
        const count = queryTerms.includes(item) ? acc.count + 1 : acc.count;
        return {...acc, query, count}
    }, {count: 0, ...doc});
    return result;
 }

const relevantSort = (search1, search2) => search2.count - search1.count;

export default (docs) => {
    const search = (word) => {
        return docs
            .map((doc) => getFuzzySearch(doc, word))
            .filter(search => search.count > 0)
            .sort(relevantSort)
            .map(search => search.id);
    }
    return {search};
};
