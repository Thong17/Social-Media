module.exports = (seq, type) => {
    const Users = seq.define("Users", {
        username: {
            type: type.STRING,
            allowNull: false
        },
        password: {
            type: type.STRING,
            allowNull: false
        },
        photo: {
            type: type.STRING,
            allowNull: true
        }
    })

    // User's posts
    Users.associate = (models) => {
        Users.hasMany(models.Posts, {
            onDelete: "cascade",
            constraints: true,
            allowNull:true
        })
        models.Posts.belongsTo(Users, {
            foreignKey: 'UserId'
        })
    }

    return Users
}