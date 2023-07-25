import express, { Request, Response }  from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
const validUrl = require('valid-url');

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  app.get("/filteredimage", async (req: Request, res: Response) => {
    
		// Get image url query ?image_url={}
		let image_url: string = req.query.image_url as string;

		// validate the image url
    let isMatchExt = image_url.match(/\.(jpeg|jpg|gif|png)$/) != null;
		if (!(validUrl.isUri(image_url) && isMatchExt)) {
			return res.status(400).send("The image_url is invalid!");
		}

		// Filter the image
    let fImage:string;
    try {
      fImage = await filterImageFromURL(image_url);
    } catch(e){
			return res.status(400).send("Can not filter image_url!");
    }
		
		// Response the filtered image
		res.sendFile(fImage, (err) => {
			// delete local temporary file
			try {
				deleteLocalFiles([fImage]);
			} catch (e) {
				console.log(e);
			}
		});
	});
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();