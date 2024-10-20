export {asyncHandeler};
export {promiseHandeler}

const asyncHandeler = (requestHandler) => async(req, res, next) => {
    try {
        await requestHandler(req, res, next)
    } catch (error) {
        res.status(err.code || 500).json({
            success : false,
            message : err.message
        })
    }
}

const promiseHandeler = (reqestHandler) => {
    (req, res, next) => {
        Promise.resolve(reqestHandler(res, req, next)).catch((err) => next(err))
    }
}