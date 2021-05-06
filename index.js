// @ts-check

const getTerms = (text) => text.match(/\w+/g);

const buildTermValue = (prev = [], id) => {
  const prevIdValue = prev.find((item) => item.id === id);
  if (!prevIdValue) {
    return [...prev, { id, count: 1 }];
  }
  const nextIdValue = { ...prevIdValue, count: prevIdValue.count + 1 };
  return prev.map((item) => (item.id === id ? nextIdValue : item));
};

const buildReversedIndex = (docs) => {
  const dic = docs.flatMap((doc) => getTerms(doc.text).map((item) => ({ term: item, id: doc.id })));
  return dic.reduce((acc, item) => {
    const { term, id } = item;
    const prevTermValue = acc[term];
    const nextTermValue = buildTermValue(prevTermValue, id);
    return { ...acc, [term]: nextTermValue };
  }, {});
};

const relevantSort = (search1, search2) => search2.meta.tfIdf - search1.meta.tfIdf;

/**
 * in: [
 *  {id: 'doc1', count: 1},
 *  {id: 'doc2', count: 1},
 *  {id: 'doc2', count: 3},
 * ]
 *
 * out: [
 *  {id: 'doc1', count: 1},
 *  {id: 'doc2', count: 4},
 * ]
 */

const reduceCount = (acc, docItem) => {
  const { id, count } = docItem;
  const prevIdItem = acc.find((item) => item.id === id);
  if (!prevIdItem) {
    return [...acc, { id, count }];
  }
  const nextIdItem = { ...prevIdItem, count: prevIdItem.count + count };
  return acc.map((item) => (item.id === id ? nextIdItem : item));
};

/**
 * wtf is tf-idf?
 * TF - количество искомого слова в текущем документе / количество всех слов в текущем документе.
 * idf = десятичный логарифм от
 * количества всех документов /
 * количества документов содержащих искомое слово
 */

const getTfIdf = (info, docsInfo, docs) => {
  const targetWordCount = info.count;
  const currentDoc = docs.find((doc) => doc.id === info.id);
  const allWordsCount = currentDoc.text.split(' ').length;
  const tf = targetWordCount / allWordsCount;

  const allDocsCount = docs.length;
  const targetDocsCount = docsInfo.length;

  const idf = Math.log10(allDocsCount / targetDocsCount);
  return tf * idf;
};

export default (docs) => {
  const dic = buildReversedIndex(docs);
  const search = (word) => {
    const queryTerms = getTerms(word);
    const docsInfo = queryTerms.flatMap((term) => dic[term]).reduce(reduceCount, []);
    return docsInfo
      .map((info) => ({ ...info, meta: { tfIdf: getTfIdf(info, docsInfo, docs) } }))
      .sort(relevantSort)
      .map((docInfo) => docInfo.id);
  };
  return { search };
};
