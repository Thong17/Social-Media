module.exports = (seq, type) => {
    const Images = seq.define("Images", {
        photo: {
            type: type.STRING,
            allowNull: false
        }
    })

    return Images
}