const ROLE = require("./rolesEnum");

const isAdmin = (user) => user.role === ROLE.ADMIN;

const isSubAdmin = (user) => user.role === ROLE.SUB_ADMIN;

const isUser = (user) => user.role === ROLE.USER;

module.exports = {
    isAdmin,
    isSubAdmin,
    isUser
};