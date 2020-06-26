const ipcRenderer = window.require("electron").ipcRenderer;

interface Contact {
  contactId: number;
  name: string;
  email: string;
  phone: string;
  adress: string;
}

// Form handling
const form: HTMLFormElement = document.querySelector("#form");

form.onsubmit = (): boolean => {
  const formData = new FormData(form);
  form.reset();

  const formDataObject: { [k: string]: string } = {};
  formData.forEach((value, key) => {
    formDataObject[key] = value as string;
  });

  ipcRenderer.send("submitInfo", formDataObject);

  return false;
};

// Handle delete
function handleDelete(e: Event): void {
  const btn: HTMLElement = e.target as HTMLElement;
  const parentId: string = btn.closest("li").id;
  ipcRenderer.send("deleteContact", parentId);
}

// Creates a UI contact card component
function contactCardFactory(arg: Contact): HTMLElement {
  // Create Elements

  const li = document.createElement("LI");
  li.id = String(arg.contactId);
  const card = document.createElement("DIV");
  const header = document.createElement("HEADER");
  const pHeaderTitle = document.createElement("P");
  const cardContent = document.createElement("DIV");
  const adress = document.createElement("P");
  const email = document.createElement("P");
  const number = document.createElement("P");
  const footer = document.createElement("FOOTER");

  const deleteBtn = document.createElement("A");
  deleteBtn.id = "deleteBtn";
  deleteBtn.addEventListener("click", handleDelete);

  // Attribute classes

  card.classList.add("card");
  header.classList.add("card-header");
  pHeaderTitle.classList.add("card-header-title");
  cardContent.classList.add("card-content");
  adress.classList.add("is-size-7");
  email.classList.add("is-size-7");
  number.classList.add("is-size-7");
  footer.classList.add("card-footer");
  deleteBtn.classList.add("card-footer-item");

  // Attribute texts

  const textTitle = document.createTextNode(arg.name);
  const textAdress = document.createTextNode(`Adress.: ${arg.adress}`);
  const textEmail = document.createTextNode(`Email.: ${arg.email}`);
  const textNumber = document.createTextNode(`Phone.: ${arg.phone}`);
  const btnText = document.createTextNode("Delete");

  // Build structure

  pHeaderTitle.appendChild(textTitle);
  email.appendChild(textEmail);
  number.appendChild(textNumber);
  adress.appendChild(textAdress);
  deleteBtn.appendChild(btnText);

  footer.appendChild(deleteBtn);

  cardContent.appendChild(email);
  cardContent.appendChild(number);
  cardContent.appendChild(adress);

  header.appendChild(pHeaderTitle);

  card.appendChild(header);
  card.appendChild(cardContent);
  card.appendChild(footer);

  li.appendChild(card);
  li.style.padding = "16px 0px";

  return li;
}

// List all the contacts from database
document.addEventListener("DOMContentLoaded", function () {
  ipcRenderer.send("mainWindowLoaded");
  ipcRenderer.on("indexDatabaseLoaded", (event, arg) => {
    arg
      .reverse()
      .map((arg: Contact) =>
        document.getElementById("myList").appendChild(contactCardFactory(arg))
      );
  });
});

// Removes contact card from UI
ipcRenderer.on("contactDataDeleted", function (event, arg) {
  const li = document.getElementById(arg);
  li.remove();
});

// Appends newly created card to the contact list
ipcRenderer.on("appendNewContact", function (event, arg) {
  const ul = document.getElementById("myList");
  ul.insertBefore(contactCardFactory(arg), ul.firstChild);
});
