// Time = 4s average

const fs = require("fs/promises");

(async() => {
    console.time("WriteMany");
    const fileHandle = await fs.open("test.txt", "w");
    for (let i = 0; i < 100000; i++) {
        await fileHandle.write(` ${i} `);
    }
    console.timeEnd("WriteMany");
})();

// ========================================================

// Time = 0.5s average

// The performance is far beter using callbacks than promises. The only problem is, below code is using synchronous
// method to write to the file.

// const fs = require("fs");

(async() => {
    console.time("WriteMany");
    fs.open("test.txt", "w", (err, fd) => {
        for (let i = 0; i < 100000; i++) {
            const buff = Buffer.from(` ${i} `, "utf-8");
            fs.writeSync(fd, buff);
        }
    })
    console.timeEnd("WriteMany");
})();

// ===========================================

// Time: 122ms average but has a lot of memory usage. So this isn't a best practice 
// const fs = require("fs/promises");

(async() => {
    console.time("WriteMany");
    const fileHandle = await fs.open("test.txt", "w");

    const fileStream = fileHandle.createWriteStream();

    for (let i = 0; i < 100000; i++) {
        const buff = Buffer.from(` ${i} `, "utf-8");
        fileStream.write(buff);
    }
    console.timeEnd("WriteMany");
})();