//Collection of budget functions
const createBudget = require('../budgets/createBudget');
const readBudget = require('../budgets/readBudget');
const updateBudget = require('../budgets/updateBudget');
const deleteBudget = require('../budgets/deleteBudget');

module.exports = {
    createBudget,
    readBudget,
    updateBudget,
    deleteBudget,
};