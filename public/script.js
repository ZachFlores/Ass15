const getFormData = () => {
    const formData = new FormData(document.getElementById("addItemForm"));
    const craftData = {
        itemName: formData.get("itemName"),
        itemDescription: formData.get("itemDescription"),
        supply: formData.getAll("supply[]"),
    };
    return craftData;
};

const getCrafts = async () => {
    try {
        const response = await fetch("/api/crafts");
        return response.json();
    } catch (error) {
        console.log("Error retrieving data:", error);
        return [];
    }
};

const showModal = (craft) => {
    const modal = document.getElementById("myModal");
    const modalTitle = document.getElementById("modal-title");
    const modalBody = document.getElementById("modal-body");

    modalTitle.textContent = craft.name;
    modalBody.innerHTML = `
        <img src="images/${craft.image}" alt="${craft.name}" style="width:50%">
        <p>${craft.description}</p>
        <h3>Supplies:</h3>
        <ul>${craft.supplies.map(item => `<li>${item}</li>`).join("")}</ul>
    `;

    modal.style.display = "block";
};

const closeModal = () => {
    const modal = document.getElementById("myModal");
    modal.style.display = "none";
};

const populateGallery = async () => {
    const crafts = await getCrafts();
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";
    crafts.forEach(craft => {
        const img = document.createElement("img");
        img.src = `images/${craft.image}`;
        img.alt = craft.name;
        img.onclick = () => showModal(craft);
        gallery.appendChild(img);
    });
};

populateGallery();

document.querySelector(".w3-button").addEventListener("click", closeModal);

window.onclick = (event) => {
    const modal = document.getElementById("myModal");
    if (event.target == modal) {
        closeModal();
    }
};

const showAddItemModal = () => {
    document.getElementById("addItemModal").style.display = "block";
};


const hideAddItemModal = () => {
    const addItemForm = document.getElementById("addItemForm");
    addItemForm.reset(); 

    const suppliesContainer = document.getElementById("supplies");
    while (suppliesContainer.children.length > 1) {
        suppliesContainer.removeChild(suppliesContainer.lastChild);
    }

    document.getElementById("addItemModal").style.display = "none"; // Close the modal dialog
};

document.getElementById("cancelButton").onclick = hideAddItemModal;

document.getElementById("addItemForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(document.getElementById("addItemForm"));
    try {
        const response = await fetch("/api/addItem", {
            method: "POST",
            body: formData,
        });
        if (response.ok) {
            hideAddItemModal();
            populateGallery(); 
        } else {
            console.error("Failed to add item:", response.statusText);
        }
    } catch (error) {
        console.error("Error adding item:", error);
    }
});

document.getElementById("addCraftButton").addEventListener("click", showAddItemModal);

document.getElementById("cancelButton").onclick = hideAddItemModal;

const showSelectedImage = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
        const imageSrc = e.target.result;
        document.getElementById("previewImage").src = imageSrc; // Update the placeholder image source
        document.getElementById("modalImage").src = imageSrc; // Set the source of the image in the modal dialog
    };
    reader.readAsDataURL(file);
};

document.getElementById("itemImage").addEventListener("change", showSelectedImage);

const addSupply = () => {
    const suppliesContainer = document.getElementById("supplies");
    const lastSupplyInput = suppliesContainer.querySelector("input[type='text']:last-of-type");

    const newInput = document.createElement("input");
    newInput.type = "text";
    newInput.name = "supply[]";
    newInput.required = true;

    if (lastSupplyInput) {
        lastSupplyInput.insertAdjacentElement("afterend", newInput);
    } else {
        suppliesContainer.appendChild(newInput);
    }
};

document.getElementById("addSupplyButton").onclick = addSupply;