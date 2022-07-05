import server from './server.js'
import connectDatabase from './database/connect.js'

connectDatabase()
  .then(() => {
    server.listen('3333', () => {
		console.log('Server is running')
	})
  })
  .catch((err) => {
    console.log(err);
    console.log(`Error connecting to database!\n${err.message}`);
  });



