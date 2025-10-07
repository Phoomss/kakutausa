const prisma = require("../config/db");
const InternalServer = require("../utils/internal-server");

// Get all 3D requests
exports.getAllRequests = async (req, res) => {
    try {
        const requests = await prisma.request3D.findMany({
            include: {
                product: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: { id: 'desc' }
        });

        const formattedRequests = requests.map(request => ({
            id: request.id,
            email: request.email,
            firstName: request.firstName || '',
            lastName: request.lastName || '',
            message: request.message || '',
            productName: request.product?.name || 'N/A',
            handled: request.handled,
            createdAt: request.createdAt
        }));

        res.status(200).json({
            message: "3D requests retrieved successfully",
            data: formattedRequests
        });
    } catch (error) {
        InternalServer(res, error);
    }
};

// Update request status
exports.updateRequestStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { handled } = req.body;

        const updatedRequest = await prisma.request3D.update({
            where: { id: parseInt(id) },
            data: { handled: handled },
            include: {
                product: {
                    select: {
                        name: true
                    }
                }
            }
        });

        res.status(200).json({
            message: "Request status updated successfully",
            data: {
                id: updatedRequest.id,
                email: updatedRequest.email,
                firstName: updatedRequest.firstName || '',
                lastName: updatedRequest.lastName || '',
                message: updatedRequest.message || '',
                productName: updatedRequest.product?.name || 'N/A',
                handled: updatedRequest.handled,
                createdAt: updatedRequest.createdAt
            }
        });
    } catch (error) {
        InternalServer(res, error);
    }
};

// Delete a request
exports.deleteRequest = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.request3D.delete({
            where: { id: parseInt(id) }
        });

        res.status(200).json({
            message: "Request deleted successfully"
        });
    } catch (error) {
        InternalServer(res, error);
    }
};