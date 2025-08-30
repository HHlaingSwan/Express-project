const errorHandler = (err, req, res, next) => {

    try {
        let error = { ...err }

        error.message = err.message

        console.error(err);

        // Mongoose  bad  ObjectId
        if (err.name === "CastError") {
            const message = "Invalid Object ID";
            error = new Error(message);
            error.status = 400;
        }

        //Mongoose Dupicate key
        if (err.code === 11000) {
            const message = "Duplicate key error";
            error = new Error(message);
            error.status = 400;
        }

        //Mongoose validate error
        if (err.name === "ValidationError") {
            const message = Object.values(err.errors).map(val => val.message);
            error = new Error(message.join(", "));
            error.status = 400;
        }

        res.status(error.status || 500).json({ message: error.message });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export default errorHandler;
