module.exports = (seq, type) => {
    const Comments = seq.define("Comments", {
        comment: {
            type: type.STRING,
            allowNull: false
        }
    })

    return Comments
}