import fs from 'fs';
import Jimp = require('jimp');
import https = require('https');

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL: string): Promise<string>{
    return new Promise( async resolve => {
        const photo = await Jimp.read(inputURL);
        const outpath = '/tmp/filtered.'+Math.floor(Math.random() * 2000)+'.jpg';
        await photo
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(__dirname+outpath, (img)=>{
            resolve(__dirname+outpath);
        });
    });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files:Array<string>){
    for( let file of files) {
        fs.unlinkSync(file);
    }
}

export async function validateImageUrl(url: string): Promise<boolean>{
    return new Promise( async resolve => {
        
         https.get(url, (resp) => {

            console.log("http sent")

            var data = ''

            resp.on('data', (chunk) => {
                data += chunk
            })

            resp.on('end', () => {
                console.log(resp.headers['content-type'])

                const contentTypes = ["image/jpeg"]

                if (resp.headers['content-type'] == "image/jpeg" || resp.headers['content-type'] == "image/jpg") {
                    resolve(true)
                } else {
                    resolve(false)
                }
            }) 
            
         }).on('error', (err) => {
             console.log("Error getting image " + err);
             resolve(false)
         })
    })
}