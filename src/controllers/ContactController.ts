import connection = require("../database/connection");

interface Contact {
  contactId: number;
  name: string;
  email: string;
  phone: string;
  adress: string;
}

export = {
  async index(): Promise<Contact[]> {
    const contacts = await connection.select().from<Contact>("contacts");

    return contacts;
  },
};
