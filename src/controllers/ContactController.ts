import connection = require("../database/connection");

// eslint-disable-next-line import/no-unresolved
import { Contact } from "../shared/ContactInterface";

export = {
  async index(): Promise<Contact[]> {
    const contacts = await connection.select().from<Contact>("contacts");

    return contacts;
  },

  async create(req: Contact): Promise<Contact> {
    const [id] = await connection("contacts").insert({
      name: req.name,
      email: req.email,
      phone: req.phone,
      adress: req.adress,
    });

    const contact: Contact[] = await connection("contacts")
      .where("contactId", id)
      .select();

    return contact[0];
  },

  async delete(req: number): Promise<Contact[]> {
    const contact: Contact[] = await connection("contacts")
      .where("contactId", req)
      .select();

    if (contact[0].contactId) {
      await connection("contacts").where("contactId", req).delete();
      return contact;
    }

    return [];
  },
};
