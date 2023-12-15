import asyncHandler from 'express-async-handler'
import { prisma } from "../config/prismaConfig.js"


export const createUser = asyncHandler(async (req, res) => {
    console.log("creating a user");

    let { email } = req.body;

    const userExists = await prisma.user.count({ where: { email: email } })
    if (userExists === 0) {
        const user = await prisma.user.create({ data: req.body });
        res.send({
            message: "User registered successfully",
            user: user,
        });
    } else res.status(201).send({ message: "user already registered" })
});

// function to book a testdrive
export const bookTest = asyncHandler(async (req, res) => {
    const { email, date } = req.body
    const { id } = req.params
    try {
        const alreadyBooked = await prisma.user.findUnique({
            where: { email },
            select: { bookedVisits: true },
        });
        if (alreadyBooked.bookedVisits.some((visit) => visit.id === id)) {
            res
                .status(400)
                .json({ message: "Test drive is already booked by you" });
        } else {
            await prisma.user.update({
                where: { email: email },
                data: {
                    bookedVisits: { push: { id, date } },
                },
            });
            res.send("your Test drive is booked successfully");
        }
    } catch (err) {
        throw new Error(err.message);
    }
});

// function to get all testdrive bookings
export const allTests = asyncHandler(async(req,res)=>{
    const {email} = req.body
    try{
        const bookings = await prisma.user.findUnique({
            where:{email},
            select:{bookedVisits:true}
        })
        res.status(200).send(bookings)
    }catch(err){
        throw new Error(err.message)
    }
})

// function to cancel booking
export const cancelTest = asyncHandler(async(req,res)=>{
    const {email} = req.body
    const {id} = req.params
    try{
        const user = await prisma.user.findUnique({
            where:{email:email},
            select:{bookedVisits:true}
        })

        const index = user.bookedVisits.findIndex((visit)=>visit.id === id)

        if(index=== -1){
            res.status(404).json({message:"Testdrive not found"})
        }else{
            user.bookedVisits.splice(index,1)
            await prisma.user.update({
                where:{email},
                data:{
                    bookedVisits:user.bookedVisits
                }
            })
            res.send("Testdrive cancelled successfully")
        }

    }catch(err){
        throw new Error(err.message)
    }
})

// function to add favourites
export const toFav = asyncHandler(async(req,res)=>{
    const {email} = req.body;
    const {rid}= req.params;
    
    try{

        const user = await prisma.user.findUnique({
            where:{email}
        })

        if(user.favVehicleID.includes(rid)){
            const updateUser = await prisma.user.update({
                where:{email},
                data:{
                    favVehicleID:{
                        set:user.favVehicleID.filter((id)=>id !==rid)
                    }
                }
            })
            res.send({message:"Removed from favourites", user:updateUser})

        }else{
            const updateUser = await prisma.user.update({
                where:{email},
                data:{
                    favVehicleID:{
                        push:rid
                    }
                }
            })
            res.send({message:"Favourites updated", user:updateUser})
        }

    }catch(err){
        throw new Error(err.message)
    }
})

// function to get all favourites
export const allFav = asyncHandler(async(req,res)=>{
    const {email} = req.body;
    
    try{
        const favVehicle = await prisma.user.findUnique({
            where:{email},
            select:{favVehicleID:true}
        })
        res.status(200).send(favVehicle)
    }catch(err){
        throw new Error(err.message)
    }
})