const prisma = require("../config/db");
const InternalServer = require("../utils/internal-server");

exports.getDashboardStats = async (req, res) => {
    try {
        // Get counts for different entities from the actual schema
        const userCount = await prisma.user.count();
        const productCount = await prisma.product.count();
        const categoryCount = await prisma.category.count();
        const request3DCount = await prisma.request3D.count(); // Count of 3D model requests

        // Get recent 3D model requests
        const recentRequests = await prisma.request3D.findMany({
            orderBy: { id: 'desc' },
            take: 5,
            include: {
                product: {
                    select: {
                        name: true
                    }
                }
            }
        }).then(requests => 
            requests.map(r => ({
                id: r.id,
                email: r.email,
                firstName: r.firstName || '',
                lastName: r.lastName || '',
                message: r.message || '',
                productName: r.product?.name || 'N/A',
                handled: r.handled,
                createdAt: r.createdAt
            }))
        );
        
        // Get recent users
        const recentUsers = await prisma.user.findMany({
            orderBy: { id: 'desc' }, // Using id instead of createdAt since schema doesn't have createdAt for User
            take: 5,
            select: {
                id: true,
                username: true,
                email: true,
                role: true
            }
        });
        
        // Get most popular categories (by product count)
        const categoryStats = await prisma.category.findMany({
            include: {
                _count: {
                    select: { products: true }
                }
            },
            orderBy: { products: { _count: 'desc' } },
            take: 5
        }).then(categories => 
            categories.map(c => ({
                name: c.name,
                productCount: c._count.products
            }))
        );
        
        // Get products by category for visualization
        const productsByCategory = await prisma.category.findMany({
            include: {
                _count: {
                    select: { products: true }
                }
            }
        }).then(categories => 
            categories.map(c => ({
                month: c.name.substring(0, 3), // Using category name for visualization
                amount: c._count.products
            })).slice(0, 9) // Limit to 9 for visualization
        );

        // Return comprehensive statistics based on actual schema
        const stats = {
            totalUsers: userCount,
            totalProducts: productCount,
            totalCategories: categoryCount,
            total3DRequests: request3DCount,
            recentUsers: recentUsers,
            recentRequests: recentRequests,
            popularCategories: categoryStats,
            productsByCategory: productsByCategory
        };

        res.status(200).json({
            message: "Dashboard stats retrieved successfully",
            data: stats
        });
    } catch (error) {
        InternalServer(res, error);
    }
};