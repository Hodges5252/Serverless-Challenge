module.exports = {
    calculateTotalPercentage: (categories) => {
        return categories.reduce((sum, cat) => sum + cat.percentage, 0);
    },

    isValidPercentage: (categories) => {
        const total = module.exports.calculateTotalPercentage(categories);
        return total === 100;
    },
};