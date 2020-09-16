const mongoose = require("mongoose"); //require modules
// const env = require("dotenv").config();
console.log("here");
mongoose
	.connect(
		"mongodb+srv://shai8989169:@cluster0.mx9fs.mongodb.net/doremi?retryWrites=true&w=majority",
		{
			useNewUrlParser: true,
			useCreateIndex: true,
			//useFindAndModify: false,
			useUnifiedTopology: true,
		}
	)
	.then(() => console.log("connected"))
	.catch((err) => console.log(err));
