const InternalServer = (res, error) => {
    console.error('Error:', error);
    
    const response = {
        message: "Internal Server Error"
    };

    if (process.env.NODE_ENV === 'development') {
        response.error = error.message;
    }

    return res.status(500).json(response);
};

module.exports = InternalServer;