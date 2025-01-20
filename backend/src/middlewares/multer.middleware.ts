import multer from 'multer';

const upload = multer({   // multer middleware
    dest: 'uploads/'
});

export default upload;