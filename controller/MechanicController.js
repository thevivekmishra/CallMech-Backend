import mechanicModel from "../models/MechanicModel.js"

const changeAvailability = async (req, res) => {
    try {
        const { mechId } = req.body

        const mechData = await mechanicModel.findById(mechId)
        await mechanicModel.findByIdAndUpdate(mechId, { available: !mechData.available }) // Fixed typo

        return res.status(200).json({
            success: true,
            message: "Availability changed"
        })
    } catch (error) {
        // console.log(error)
        return res.status(400).json({
            success: false,
            message: "Failed to change availability"
        })
    }
}

export { changeAvailability }
