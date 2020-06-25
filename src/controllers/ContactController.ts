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

  async create(req: Contact): Promise<number> {
    const [id] = await connection("contacts").insert({
      name: req.name,
      email: req.email,
      phone: req.phone,
      adress: req.adress,
    });

    return id;
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
