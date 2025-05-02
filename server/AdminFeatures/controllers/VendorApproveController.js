const Vendor = require('../../VendorFeatures/models/Vendor');

// Get Pending Vendors
exports.getPendingVendors = async (req, res)=>{
    try {
        const vendors = await Vendor.find({approvedStatus: 'pending'});
        res.status(200).json(vendors);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Internal Server Error'})
    }
};

// Approve Vendors
exports.approveVendor = async (req, res)=>{
    try {
        const vendor = await Vendor.findByIdAndUpdate(req.params.id, {approvedStatus : 'approved'});
        if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
        res.json({ message: 'Vendor approved' });
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Internal Server Error'})
    }
}

// Rejected Vendors
exports.approveRejected = async (req, res)=>{
    try {
        const vendor = await Vendor.findByIdAndUpdate(req.params.id, {approvedStatus : 'rejected'});
        if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
        res.json({ message: 'Vendor Rejected' });
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Internal Server Error'})
    }
}