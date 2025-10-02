const prisma = require("../config/db");
const InternalServer = require("../utils/internal-server");

exports.getDashboardStats = async (req, res) => {
    try {
        // Get counts for different entities
        const userCount = await prisma.user.count();
        const productCount = await prisma.product.count();
        const categoryCount = await prisma.category.count();
        const orderCount = 0; // Assuming there's no order table, or using a different logic

        // Return basic statistics
        const stats = {
            totalUsers: userCount,
            totalProducts: productCount,
            totalCategories: categoryCount,
            totalOrders: orderCount
        };

        res.status(200).json({
            message: "Dashboard stats retrieved successfully",
            data: stats
        });
    } catch (error) {
        InternalServer(res, error);
    }
};