module.exports = {
    getChannelIdFromMention(mention) {
        if (!mention) return;

        if (mention.startsWith('<#') && mention.endsWith('>')) {
            mention = mention.slice(2, -1);
    
            return mention;
        }

        return mention;
    }
}