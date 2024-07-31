export const getMatches = (text: string, searchTerm: string, limit = 1) => {
    // create dynamic regex 😎
    const regex = new RegExp(searchTerm, 'gi');
    // word indexes
    const indexes = [];
    // matches count
    let matches = 0;
    // current match in loop
    let match;

    while ((match = regex.exec(text)) !== null && matches < limit) {
        // push that shit
        indexes.push(match.index);
        // increment matches
        matches++;
    }

    return indexes.map((index) => {
        // go back 20 characters
        const start = index - 20;
        // go forward 80 characters
        const end = index + 80;
        // yoink the text
        const excerpt = text.substring(start, end).trim();
        // return excerpt 🤝
        return `...${replaceTextWithMarker(excerpt, searchTerm)}...`;
    });
};

export const replaceTextWithMarker = (text: string, match: string) => {
    // create dynamic regex 😎
    const regex = new RegExp(match, 'gi');
    // preserves the text casing 🤙
    return text.replaceAll(regex, (match) => `<mark>${match}</mark>`);
};
