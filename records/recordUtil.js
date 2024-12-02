module.exports = {
    allocateAmountToCategories: (categories, amount) => {
        const allocations = {};
        categories.forEach((category) => {
            allocations[category.categoryName] = (amount * category.percentage) / 100;
        });
        return allocations;
    },
};