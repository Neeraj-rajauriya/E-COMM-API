import multer from "multer";

const storage=multer.diskStorage({
    destination:(req,res,next)=>{
        next(null,'./images');
    },
    filename:(req,file,next)=>{
         next(null,Date.now()+" - "+file.originalname);
    }
});

export const upload=multer({storage:storage});