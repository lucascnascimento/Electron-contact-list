import knex = require("knex");
import configuration = require("../../knexfile");

const environment = process.env.NODE_ENV || "development";

const config = environment === "development" && configuration.development;

const connection = knex(config);

export = connection;
