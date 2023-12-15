import asyncHandler from 'express-async-handler'
import { prisma } from "../config/prismaConfig.js"

export const createVehicle = asyncHandler(async (req, res) => {
    const { title, description, price, address, country, city, specifications, image, userEmail } = req.body.data

    console.log(req.body.data)
    try {
        const vehicle = await prisma.vehicle.create({
            data: {
                title, description, price, address, country, city, specifications,
                image, owner: { connect: { email: userEmail } },
            }
        })
        res.send({
            message: "Vehicle created successfully",
            vehicle
        });

    } catch (err) {
        if (err.code === "P2002") {
            throw new Error("A vehicle with address already there")
        }
        throw new Error(err.message)
    }
});

//get all vehicles
export const getAllVehicle = asyncHandler(async (req, res) => {
    try {
        const vehicles = await prisma.vehicle.findMany();
        res.send(vehicles);
    } catch (error) {
        console.error('Error fetching vehicles:', error);
        res.status(500).send({
            error: 'Internal Server Error',
            message: error.message,
        });
    }

});


//get specific vehicle
export const getVehicle = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const vehicle = await prisma.vehicle.findUnique({
            where: { id },
        });
        res.send(vehicle);
    } catch (err) {
        throw new Error(err.message);
    }
});