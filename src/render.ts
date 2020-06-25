const ipcRenderer = window.require("electron").ipcRenderer;

// TODO
/*TODO: Create a UI contact card factory. Delete the respective UI from database
  and send confirmation to delete from UI. Append created UI element as the last
  from the LI list. Check for null rendering
*/

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
function contactCardFactory(arg: Contact): void {
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
  const textAdress = document.createTextNode(arg.adress);
  const textEmail = document.createTextNode(arg.email);
  const textNumber = document.createTextNode(arg.phone);
  const btnText = document.createTextNode("Delete");

  // Build structure

  pHeaderTitle.appendChild(textTitle);
  adress.appendChild(textAdress);
  email.appendChild(textEmail);
  number.appendChild(textNumber);
  deleteBtn.appendChild(btnText);

  footer.appendChild(deleteBtn);

  cardContent.appendChild(adress);
  cardContent.appendChild(email);
  cardContent.appendChild(number);

  header.appendChild(pHeaderTitle);

  card.appendChild(header);
  card.appendChild(cardContent);
  card.appendChild(footer);

  li.appendChild(card);
  li.style.padding = "16px 0px";

  document.getElementById("myList").appendChild(li);
}

// List of contacts handling
document.addEventListener("DOMContentLoaded", function () {
  ipcRenderer.send("mainWindowLoaded");
  ipcRenderer.on("indexDatabaseLoaded", (event, arg) => {
    arg.map((arg: Contact) => contactCardFactory(arg));
  });
});

ipcRenderer.on("contactDataDeleted", function (event, arg) {
  const li = document.getElementById(arg);
  li.remove();
});
