import server from './server.js'
import connectDatabase from './database/connect.js'
import variables from './config/EnviromentVariables.js'

const PORT = variables.PORT

connectDatabase()
  .then(() => {
    server.listen(PORT, () => {
		console.log(`Server is running at port ${PORT}`)
	})
  })
  .catch((err) => {
    console.log(err);
    console.log(`Error connecting to database!\n${err.message}`);
  });



