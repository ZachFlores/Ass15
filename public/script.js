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
    document.getElementById("addItemModal").style.display = "none";
    document.getElementById("addItemForm").reset();
};

document.getElementById("addItemForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(document.getElementById("addItemForm"));
    let response;
    try {
            response = await fetch("/api/crafts", {
            method: "POST",
            body: formData,
        });
        if (response.ok) {
            hideAddItemModal();
            populateGallery();
        } else {
            console.error("Failed to add item:", response.statusText);
            response.json().then(data => {
                console.log("Response body:", data);
            });
        }
    } catch (error) {
        console.error("Error adding item:", error);
    }
});

const addSupply = () => {
    const suppliesContainer = document.getElementById("supplies");
    const input = document.createElement("input");
    input.type = "text";
    input.name = "supply[]";
    input.required = true;
    suppliesContainer.appendChild(input);
    suppliesContainer.appendChild(document.createElement("br"));
};

const showSelectedImage = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
        const imageSrc = e.target.result;
        document.getElementById("previewImage").src = imageSrc;
    };
    reader.readAsDataURL(file);
};

document.getElementById("itemImage").addEventListener("change", showSelectedImage);

document.getElementById("addCraftButton").addEventListener("click", showAddItemModal);

document.getElementById("addSupplyButton").addEventListener("click", addSupply);

document.getElementById("cancelButton").addEventListener("click", hideAddItemModal);
