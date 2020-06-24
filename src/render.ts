const ipcRenderer = window.require("electron").ipcRenderer;

interface Contact {
  contactId: number;
  name: string;
  email: string;
  phone: string;
  adress: string;
}

function handleSubmit(e: Event): void {
  e.preventDefault();
  const formData = new FormData(e.target as HTMLFormElement);
  console.log(formData);
}

const form = document.getElementById("form");
form.addEventListener("submit", handleSubmit);

document.addEventListener("DOMContentLoaded", function () {
  ipcRenderer.send("mainWindowLoaded");
  ipcRenderer.on("indexDatabaseLoaded", (event, arg) => {
    arg.map((arg: Contact) => {
      // Create Elements

      const li = document.createElement("LI");
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
    });
  });
});
