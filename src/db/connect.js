const mongoose = require("mongoose"); //require modules
// const env = require("dotenv").config();
mongoose
	.connect(
		"mongodb+srv://shai:shaidrai@cluster0.mx9fs.mongodb.net/doReMi?retryWrites=true&w=majority",
		{
			useNewUrlParser: true,
			useCreateIndex: true,
			//useFindAndModify: false,
			useUnifiedTopology: true,
		}
	)
	.then(() => console.log("DB Connected"))
	.catch((err) => console.log(err));
