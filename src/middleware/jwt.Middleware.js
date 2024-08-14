import jwt from 'jsonwebtoken';

const jwtAuth=(req,res,done)=>{
    const authhead=req.headers['authorization'];
    let token=authhead.split(' ')[1];
    if(!token){
        return res.status(201).send("Unauthorized");
    }
    try{
        const payload=jwt.verify(
            token,'ASD7FGxc9vbnBJeH0shchd9882abnj21haCHShBC39HJA'
        );
        console.log("from jwt",payload);
        req.userID = payload.userID;
       
    }
    catch(err){
        console.log(err);
        return res.status(401).send("Invalid Token | Unauthorized");
    }
    done();
}
export default jwtAuth;