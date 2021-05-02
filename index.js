// @ts-check

export default (docs) => {

    const search = (word) => {
        return docs
            .filter(({text}) => {
                const terms = text.match(/\w+/g);
                const words = text.split(' ')
                return [...terms, ...words].find(item => item === word)
            })
            .map(doc => doc.id);
    }
    return {search};
};
