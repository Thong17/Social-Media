module.exports = (seq, type) => {
    const Posts = seq.define("Posts", {
        description: {
            type: type.STRING,
            allowNull: false
        },
    })

    // Post's photos
    Posts.associate = (models) => {
        Posts.hasMany(models.Images, {
            onDelete: "cascade"
        })
        Posts.hasMany(models.Comments, {
            onDelete: "cascade"
        })
        Posts.hasMany(models.Likes, {
            onDelete: "cascade"
        })
        
    }

    return Posts
}