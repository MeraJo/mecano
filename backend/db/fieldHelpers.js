function normalizeTagsInput(tags) {
    if (Array.isArray(tags)) {
        return tags
            .map((tag) => String(tag).trim())
            .filter(Boolean)
            .join(', ');
    }

    if (tags === undefined || tags === null) {
        return '';
    }

    return String(tags)
        .split(/[,;\n|]/)
        .map((tag) => tag.trim())
        .filter(Boolean)
        .join(', ');
}

function tagsToArray(tags) {
    if (!tags) {
        return [];
    }

    if (Array.isArray(tags)) {
        return [...new Set(tags.map((tag) => String(tag).trim()).filter(Boolean))];
    }

    return [...new Set(String(tags)
        .split(/[,;\n|]/)
        .map((tag) => tag.trim())
        .filter(Boolean))];
}

function mergeTags(...tagGroups) {
    const merged = new Set();
    tagGroups.flat().forEach((tag) => {
        const value = String(tag || '').trim();
        if (value) {
            merged.add(value);
        }
    });
    return [...merged];
}

module.exports = {
    normalizeTagsInput,
    tagsToArray,
    mergeTags
};