// Time = 4s average

// const fs = require("fs/promises");

// (async() => {
//     console.time("WriteMany");
//     const fileHandle = await fs.open("test.txt", "w");
//     for (let i = 0; i < 100000; i++) {
//         await fileHandle.write(` ${i} `);
//     }
//     console.timeEnd("WriteMany");
// })();

// ========================================================

// Time = 0.5s average

// The performance is far beter using callbacks than promises. The only problem is, below code is using synchronous
// method to write to the file.

// const fs = require("fs");

// (async() => {
//     console.time("WriteMany");
//     fs.open("test.txt", "w", (err, fd) => {
//         for (let i = 0; i < 100000; i++) {
//             const buff = Buffer.from(` ${i} `, "utf-8");
//             fs.writeSync(fd, buff);
//         }
//     })
//     console.timeEnd("WriteMany");
// })();

// ===========================================

// Time: 122ms average but has a lot of memory usage. So this isn't a best practice 
const fs = require("fs/promises");

// (async() => {
//     console.time("WriteMany");
//     const fileHandle = await fs.open("test.txt", "w");

//     const stream = fileHandle.createWriteStream();

//     for (let i = 0; i < 100000; i++) {
//         const buff = Buffer.from(` ${i} `, "utf-8");
//         stream.write(buff);
//     }
//     console.timeEnd("WriteMany");
// })();


// The right way to do. Slightly takes more time than above approach but consumes far lesser memory and is quick
(async() => {
    console.time("WriteMany");
    let i = 0;
    
    const fileHandle = await fs.open("test.txt", "w");

    const stream = fileHandle.createWriteStream();

    const numberOfWrites = 100000;
    const writeMany = () => {
        while ( i < numberOfWrites) {
            const buff = Buffer.from(` ${i} `, "utf-8");
            
            if (i === numberOfWrites - 1) {
                return stream.end(buff);
            }

            if (!stream.write(buff)) break;

            i++;
        }
    };
    writeMany();

    stream.on("drain", () => {
        writeMany();
    });

    stream.on("finish", () => {
        console.timeEnd("WriteMany")
        fileHandle.close();
    })

})();