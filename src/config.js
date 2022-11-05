import MongoStore from 'connect-mongo'
import dotenv from 'dotenv';
dotenv.config();

export const config = {
    sqlite3: {
        client: 'sqlite3',
        connection: {
            filename: `./DB/ecommerce.sqlite`
        },
        useNullAsDefault: true
    },
    mariaDb: {
        client: 'mysql',
        connection: {
            host: process.env.HOST,
            user: process.env.USER,
            password: process.env.PASSWORD,
            database: process.env.DATABASE
        }
    },
    fileSystem: {
        path: process.env.PATH
    },
    mongoRemote: {

        store: MongoStore.create(
            {
                mongoUrl: process.env.MONGO_URL,
                mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true }
            }),
        secret: 'secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: 10000
        }
    },
    mongodb: {
        cnxStr: process.env.CNXSTR,
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            //useCreateIndex: true,
            //serverSelectionTimeoutMS: 5000,
        }
    }
}