import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import { filterImageFromURL, deleteLocalFiles } from "./util/util";
const isImageURL = require("image-url-validator").default;

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  app.get("/filteredimage", async (req, res) => {
		// Get image url query ?image_url={}
		let { image_url } = req.query;

		// validate the image url
		let isUrlValid = await isImageURL(image_url);
		if (!isUrlValid) {
			return res.status(400).send("The image_url is invalid!");
		}

		// Filter the image
		let fImage = await filterImageFromURL(image_url);

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