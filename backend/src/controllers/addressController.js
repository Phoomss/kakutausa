const prisma = require("../config/db");
const InternalServer = require("../utils/internal-server");

exports.createAddress = async (req, res) => {
    const { addressTypeId, address, phone1, phone2, email } = req.body;
    try {
        if (!addressTypeId || !address || !phone1 || !email) {
            return res.status(400).json({ message: "addressTypeId, address, phone1, and email are required" });
        }

        const parseAddressTypeId = parseInt(addressTypeId)
        const newAddress = await prisma.address.create({
            data: {
                addressTypeId: parseAddressTypeId,
                address,
                phone1,
                phone2,
                email
            }
        });

        return res.status(201).json({
            message: "Address created successfully",
            data: newAddress
        });
    } catch (error) {
        InternalServer(res, error)
    }
}

exports.getAllAddresses = async (req, res) => {
    try {
        const addresses = await prisma.address.findMany({
            include: {
                addressType: {
                    select: {
                        id: true,
                        name: true, // ดึงแค่ name
                    },
                },
            },
            orderBy: {
                id: 'asc',
            },
        });

        return res.status(200).json({
            message: "Addresses fetched successfully",
            data: addresses,
        });
    } catch (error) {
        InternalServer(res, error);
    }
};

exports.getAddressById = async (req, res) => {
    const { id } = req.params;
    try {
        const address = await prisma.address.findUnique({
            where: { id: parseInt(id) },
            include: {
                addressType: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        if (!address) {
            return res.status(404).json({ message: "Address not found" });
        }

        return res.status(200).json({
            message: "Address fetched successfully",
            data: address,
        });
    } catch (error) {
        InternalServer(res, error);
    }
};

exports.updateAddress = async (req, res) => {
    const { id } = req.params;
    const { addressTypeId, address, phone1, phone2, email } = req.body;
    try {
        const addressRecord = await prisma.address.findUnique({
            where: { id: parseInt(id) }
        });

        if (!addressRecord) {
            return res.status(404).json({ message: "Address not found" });
        }

        const updatedAddress = await prisma.address.update({
            where: { id: parseInt(id) },
            data: {
                addressTypeId,
                address,
                phone1,
                phone2,
                email
            }
        });

        return res.status(200).json({
            message: "Address updated successfully",
            data: updatedAddress
        });
    } catch (error) {
        InternalServer(res, error)
    }
}

exports.deleteAddress = async (req, res) => {
    const { id } = req.params;
    try {
        const addressRecord = await prisma.address.findUnique({
            where: { id: parseInt(id) }
        });

        if (!addressRecord) {
            return res.status(404).json({ message: "Address not found" });
        }

        await prisma.address.delete({
            where: { id: parseInt(id) }
        });

        return res.status(200).json({
            message: "Address deleted successfully"
        });

    } catch (error) {
        InternalServer(res, error)
    }
}