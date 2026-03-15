exports.saveFileInfo = async (file) => {
    return {
        file_name: file.filename,
        original_name: file.originalname,
        file_path: file.path,
        file_size: file.size
    };
};