import expressAsyncHandler from "express-async-handler";
import Cart from "../models/cartModel";

const archiveCart =expressAsyncHandler(async(req,res)=>{
    try{
        const cart = await Cart.findOne({_id:req.query.id})
        if(cart){
            cart.isActive=false;
            await cart.save()
            return res.json({message:"cart updated"})
        }
    }catch (error){
        console.log(error)
    }
    return res.status(404).json({message:"cart not found"})
})

export {archiveCart}