const User = require("../Models/userModel");

const otherUserController = async (req, res) => {
    try {
        const loggedInId = req.id;;
    
        if (!loggedInId) {
            return res.status(401).json({ error: "Unauthorized: No user ID provided" });
        }


        // Fetch all users except the logged-in user
        const otherUsers = await User.find({ _id: { $ne: loggedInId } }).select("-password");

        res.status(200).send({ success: true, data: otherUsers });
    } catch (error) {
        console.error("Error fetching other users:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports = otherUserController;
