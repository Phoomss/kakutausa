const prisma = require("../config/db");
const InternalServer = require("../utils/internal-server");

exports.createAddressType = async (req, res) => {
    const { name } = req.body;
    try {
        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        const newAddressType = await prisma.addressType.create({
            data: {
                name
            }
        });

        return res.status(201).json({
            message: "Address type created successfully",
            data: newAddressType
        });
    } catch (error) {
        InternalServer(res, error)
    }
}

exports.getAllAddressTypes = async (req, res) => {
    try {
        const addressTypes = await prisma.addressType.findMany();
        return res.status(200).json({
            message: "Address types fetched successfully",
            data: addressTypes
        });
    } catch (error) {
        InternalServer(res, error)
    }
}

exports.getAddressTypeById = async (req, res) => {
    const { id } = req.params;
    try {
        const addressType = await prisma.addressType.findUnique({
            where: { id: parseInt(id) }
        });

        if (!addressType) {
            return res.status(404).json({ message: "Address type not found" });
        }
        return res.status(200).json({
            message: "Address type fetched successfully",
            data: addressType
        });
    } catch (error) {
        InternalServer(res, error)
    }
}

exports.updateAddressType = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const addressType = await prisma.addressType.findUnique({
            where: { id: parseInt(id) }
        });

        if (!addressType) {
            return res.status(404).json({ message: "Address type not found" });
        }

        const updatedAddressType = await prisma.addressType.update({
            where: { id: parseInt(id) },
            data: { name }
        });

        return res.status(200).json({
            message: "Address type updated successfully",
            data: updatedAddressType
        });
    } catch (error) {
        InternalServer(res, error)
    }
}

exports.deleteAddressType = async (req, res) => {
    const { id } = req.params;
    try {
        const addressType = await prisma.addressType.findUnique({
            where: { id: parseInt(id) }
        });

        if (!addressType) {
            return res.status(404).json({ message: "Address type not found" });
        }

        await prisma.addressType.delete({
            where: { id: parseInt(id) }
        });

        return res.status(200).json({
            message: "Address type deleted successfully"
        });
    } catch (error) {
        InternalServer(res, error)
    }
}