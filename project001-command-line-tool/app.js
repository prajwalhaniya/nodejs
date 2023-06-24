const fs = require("fs/promises");

(async () => {
    const CREATE_FILE = 'create a file';
    const DELETE_FILE = 'delete a file';
    const RENAME_FILE = 'rename the file';
    const ADD_TO_FILE = 'add to the file';

    const createFile = async (path) => {
        try {
            const existingFileHandle = await fs.open(path, "r");
            existingFileHandle.close();
            return console.log(`The file ${path} already exists`);
        } catch (error) {
            const newFileHandle = await fs.open(path, "w");
            console.log('New file is created');
            newFileHandle.close();
        }

    }

    const deleteFile = async (path) => {
        try {
            await fs.unlink(path);
            console.log('File deleted successfully');
        } catch (error) {
            if (error.code = 'ENOENT') {
                console.log('No such file exists to delete');
            } else {
                console.log('Error occured while deleting the file', error);
            }
        }

    }

    const renameFile = async (oldPath, newPath) => {
        try {
            await fs.rename(oldPath, newPath);
            console.log("File is renamed successfully");
        } catch (error) {
            if (error.code = 'ENOENT') {
                console.log(`No such file exists with path ${oldPath}`);
            } else {
                console.log('Error occured while renaming the file', error);
            }
        }

    }

    const addToFile = async (path, content) => {
        try {
            const fileHandle = await fs.open(path, "a");
            fileHandle.write(content);

        } catch (error) {
            console.log('Error occured while adding to the file', error);
        }
        console.log('Add');
    }

    const commandFileHandler = await fs.open("./command.txt", "r");
    
    commandFileHandler.on("change", async () => {
        const size = (await commandFileHandler.stat()).size;
        const buff = Buffer.alloc(size);
        const offset = 0;
        const length = buff.byteLength;
        const position = 0;

        await commandFileHandler.read(buff, offset, length, position);

        const command = buff.toString("utf-8");
        console.log(command);

        if (command.includes(CREATE_FILE)) {
            const filePath = command.substring(CREATE_FILE.length + 1);
            createFile(filePath);
        }

        if (command.includes(DELETE_FILE)) {
            const filePath = command.substring(DELETE_FILE.length + 1);
            deleteFile(filePath);
        }

        if (command.includes(RENAME_FILE)) {
            const idx = command.indexOf(" to ");
            const oldFilePath = command.substring(RENAME_FILE.length + 1, idx);
            const newFilePath = command.substring(idx + 4); 
            console.log({oldFilePath, newFilePath});
            renameFile(oldFilePath, newFilePath);
        }

        if (command.includes(ADD_TO_FILE)) {
            const idx = command.indexOf(" this content: ");
            const filePath = command.substring(ADD_TO_FILE.length + 1, idx);
            const content = command.substring(idx + 15)
            addToFile(filePath, content);
        }
    })
    
    const watcher = fs.watch('./command.txt');
    for await (const event of watcher) {
        if (event.eventType === 'change') {
            commandFileHandler.emit("change");
        }
    } 
})()