module.exports = (err, req, res, next) => {

    console.error(err); // error log

    const statusCode = res.statusCode && res.statusCode !== 200
        ? res.statusCode
        : 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        stack: process.env.NODE_ENV === "production" ? null : err.stack
    });

};