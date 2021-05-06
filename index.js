// @ts-check

const getTerms = (text) => text.match(/\w+/g);

const buildTermValue = (prev = [], id) => {
    const prevIdValue = prev.find(item => item.id === id);
    if (!prevIdValue) {
        return [...prev, {id, count: 1}];
    }
    const nextIdValue = {...prevIdValue, count: prevIdValue.count + 1};
    return prev.map(item => item.id === id ? nextIdValue : item);
}

 const buildReversedIndex = (docs) => {
    const dic = docs.flatMap(doc => getTerms(doc.text).map(item => ({term: item, id: doc.id})))
     return dic.reduce((acc, item) => {
        const {term, id} = item;
        const prevTermValue = acc[term];
        const nextTermValue = buildTermValue(prevTermValue, id)
        return {...acc, [term]: nextTermValue}
    }, {})
 }

const relevantSort = (search1, search2) => search2.count - search1.count;

const reduceCount = (acc, item) => {
    const {id, count} = item;
    const prevIdItem = acc.find(item => item.id === id);
    if (!prevIdItem) {
        return [...acc, {id, count}]
    }
    const nextIdItem = {...prevIdItem, count: prevIdItem.count + count};
    return acc.map(item => item.id === id ? nextIdItem : item);
}

export default (docs) => {
    const dic = buildReversedIndex(docs);
    const search = (word) => {
        const queryTerms = getTerms(word);
        const docsCount = queryTerms.flatMap(term => dic[term]).reduce(reduceCount, []);
        return docsCount
            .sort(relevantSort)
            .map(search => search.id);
    }
    return {search};
};
