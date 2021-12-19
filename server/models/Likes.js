module.exports = (seq, type) => {
    const Likes = seq.define("Likes", {
        isLiked: {
            type: type.BOOLEAN,
            allowNull: false
        }
    })

    return Likes
}