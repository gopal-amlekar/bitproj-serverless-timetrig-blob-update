const fetch = require('node-fetch');
const fs = require('fs');
const { BlobServiceClient } = require('@azure/storage-blob');

const url = "https://cataas.com/cat";

// Save connection string locally in local.settings.json
// In Azure, add it to Function app configuration
const storageAccountConnString = process.env["AZURE_STORAGE_CONNECTION_STRING"]

module.exports = async function (context, myTimer) {
    var timeStamp = new Date().toISOString();
    
    context.log('JavaScript Azure function timer triggered!', timeStamp);   

    if (myTimer.isPastDue)
    {
        context.log('JavaScript is running late!');
    }
    
    try {
        var buffer = await getCatImage(context);
        // await saveCatImageLocal(buffer); // Use this to check downloaded image when running locally
        await uploadCatImageToAzure(buffer, context); 
           
    } catch (error) {
        context.log(error)
    }

    context.log('JavaScript timer trigger function ran!', timeStamp);   
};

async function getCatImage(context){
    context.log('Fetching a cat image');   
    try {
        const response = await fetch(url);
        const buffer = await response.buffer();
        return buffer;
            
    } catch (error) {
        context.log("Some error occurred in fetching cat iamge: " + error)        
    }
}

function saveCatImageLocal(buffer){
    fs.writeFile('./cat.jpg', buffer, () => console.log("Saved file"));
}

async function uploadCatImageToAzure(image, context){
    
    const myContainerName = "images";   // The name of container you created

    try {
        const blobServiceClient = BlobServiceClient.fromConnectionString(storageAccountConnString);
        const containerClient = blobServiceClient.getContainerClient(myContainerName);
    
        let blobs = containerClient.listBlobsFlat();
        
        context.log ("Listing existing images in container...")

        let i = 1;
        for await (const blob of blobs){

            // CreatedOn property useful for knowing the latest uploaded image
            context.log(`Blob ${i++}: ${blob.name} created at time: ${blob.properties.createdOn}`)
    
            // Following code to download image from the blob itself 
            /*
            const fileStream = fs.createWriteStream(blob.name);
            let blockBlobClient1 = containerClient.getBlockBlobClient(blob.name);
            
            const x = await blockBlobClient1.download();
            x.readableStreamBody.pipe(fileStream);
           */
        }

        // Use next number to concat and form a new name. 
        // Better way maybe to use date/time concat
        
        const imageName = 'cat' + i + '.jpg';
        
        context.log ("Uploading new cat image: " + imageName);

        const blockBlobClient = containerClient.getBlockBlobClient(imageName);
        
        const uploadBlobResponse = await blockBlobClient.upload(image,image.length);
        
        context.log("Uploaded image " + imageName);
            
    } catch (error) {
        context.log("Error in uploading cat image: " + error)
    }

}
