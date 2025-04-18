
export const signup = (req, res) => {
    const {username, email, password} = req.body;
    if(!username || !password || !email){
        res.status(400).json({
            success: false,
            message: "All fileds are required"
        })
    }

}

export const login = () => {

}

export const logout = () => {

}