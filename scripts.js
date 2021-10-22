let container = document.createElement("div");
let row = document.createElement("div");
let brandNames = [];
let productTypesNames = [];

let filterAdded = false; //variable will be switched to true if user tried filter once

document.body.appendChild(container);
container.setAttribute("class", "container");

// Elements for heading and filter form
container.innerHTML = `
        <h1 class="heading">Find Your Makeup Products</h1>
        <form class="searchContainer row" id="filterData">
            <div class="col-12 col-md-6">
            <input
                placeholder="Brand Name ex:Pure Anada,green people etc..,"
                oninput="handleFilterChange()"
                class="searchInput"
                id="brandName"
                value=""
            />
            </div>
            <div class="col-12 col-md-6">
            <input
                placeholder="Product Type ex:Nail Polish,Lip liner etc..,"
                oninput="handleFilterChange()"
                class="searchInput"
                id="productType"
                value=""
            />
            </div>
            <div class="buttonsWrapper" >
                <a class="waves-effect waves-light btn disabled" id="filterSubmit" onclick="handleApplyFilter()"><i class="material-icons left">filter_list</i>Apply filter</a>
                <a class="waves-effect waves-light btn disabled" id="clearFilter" onclick="handleClearFilter()"><i class="material-icons left">clear_all</i>Clear filter</a>
            </div>
        </form>
        <div class="availabilitiesWrapper">
        <button class="availabilities"  id="availableBrands" onclick="handleAvailableBrands()">See Available brands</button>
          <div class="brandsWrapper" style="display:none"></div>
        <button class="availabilities"  id="availableProducts" onclick="handleAvailableProducts()">See Available Products</button>
          <div class="productTypesWrapper" style="display:none"></div>
        </div>
        <p id="noItems">No items found!!</p>
        <div class="spinnerWrapper">
            <div class="loader"></div>
            <p>Fetching your products...</p>
        </div>`;

container.appendChild(row);
row.setAttribute("class", "row");

//get required elements
let brandNameInput = document.getElementById("brandName");
let prodTypeInput = document.getElementById("productType");
let spinner = document.querySelector(".spinnerWrapper");
let noItemsPara = document.getElementById("noItems");
let brandsWrapper = document.querySelector(".brandsWrapper");
let availableBrands = document.getElementById("availableBrands");
let productTypesWrapper = document.querySelector(".productTypesWrapper");
let availableProductsTypes = document.getElementById("availableProducts");
let filterButton = document.getElementById("filterSubmit");
let clearFilterButton = document.getElementById("clearFilter");
let filterInputs = document.getElementsByClassName("searchInput");

console.log(filterInputs);
Array.from(filterInputs).forEach((item) => {
  console.log("l", item);
  item.addEventListener("keyup", function (e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      document.getElementById("filterSubmit").click();
    }
  });
});
for (let i = 0; i < filterInputs.length; i++) {
  console.log(filterInputs[i]);
}

//

//For chnaging the queryparams format
function queryParamFormat(word) {
  let formattedWord = word
    .split(" ")
    .map((item) => item.toLowerCase())
    .join("_");
  return formattedWord;
}

//handling filter whenever user typing in filter fields
function handleFilterChange() {
  if (brandNameInput.value || prodTypeInput.value) {
    //if value present, enabling buttons
    console.log("filterAdded", filterAdded);
    filterButton.classList.remove("disabled");
    clearFilterButton.classList.remove("disabled");
  } else if (!brandNameInput.value && !prodTypeInput.value && !filterAdded) {
    //if value not present, disabling buttons
    console.log("filterAdded", filterAdded);
    filterButton.classList.add("disabled");
    clearFilterButton.classList.add("disabled");
  }
}

//while clicking Apply filter button
function handleApplyFilter() {
  getItems(
    brandNameInput.value.toLowerCase(),
    queryParamFormat(prodTypeInput.value)
  );
  spinner.style.display = "flex";
  noItemsPara.style.display = "none";
  row.innerHTML = "";
  filterAdded = true;
  // brandsWrapper.style.display = "none";
  // productTypesWrapper.style.display = "none";
  // handleAvailableBrands();
  // handleAvailableProducts();
}

//Clearing filter values
function handleClearFilter() {
  brandNameInput.value = "";
  prodTypeInput.value = "";
  console.log(filterAdded);
  clearFilterButton.classList.add("disabled");
  filterButton.classList.add("disabled");
  if (filterAdded) {
    //if filters were present while clearing filters, will call fetch all items once
    row.innerHTML = "";
    getItems();
    filterAdded = false;
  }
}

//Showing available brands
const handleAvailableBrands = () => {
  console.log("mm", availableBrands, brandsWrapper);
  if (brandsWrapper.style.display === "none") {
    brandsWrapper.style.display = "flex";
    availableBrands.innerText = "Hide Available Brands ";
    brandNames.forEach((item, index) => {
      let test = item;
      brandsWrapper.innerHTML += `<div class="brandAndProds" id=brand${index} onclick="setBrandFilter(${index})">${item}</div>`;
    });
  } else {
    brandsWrapper.style.display = "none";
    availableBrands.innerText = "See Available Brands ";
  }

  //document.querySelector(".availabilities").innerText = "Hide Available Brands";
};

//Showing available products
const handleAvailableProducts = () => {
  console.log("mm", availableProductsTypes, productTypesWrapper);
  if (productTypesWrapper.style.display === "none") {
    productTypesWrapper.style.display = "flex";
    availableProductsTypes.innerText = "Hide Available Products ";
    productTypesNames.forEach((item, index) => {
      productTypesWrapper.innerHTML += `<div class="brandAndProds" id=product${index} onclick="setProductFilter(${index})">${item}</div>`;
    });
  } else {
    productTypesWrapper.style.display = "none";
    availableProductsTypes.innerText = "See Available Products ";
  }

  //document.querySelector(".availabilities").innerText = "Hide Available Brands";
};

//adding selected brand to filter brand input
const setBrandFilter = (index) => {
  let name = document.getElementById(`brand${index}`).innerText;
  brandNameInput.value = name;
  handleFilterChange();
};

//adding selected product to filter product type input
const setProductFilter = (index) => {
  console.log(index);
  let name = document.getElementById(`product${index}`).innerText;

  prodTypeInput.value = name;
  handleFilterChange();
};

//handling data Once data successfully fetched
function handleSuccess(makeupProds) {
  spinner.style.display = "none"; //hiding spinner after successfull fetch
  brandNameInput.removeAttribute("disabled"); //enabling filter inputs once data sucessfully fetched
  prodTypeInput.removeAttribute("disabled");
  console.log(makeupProds);
  let productsBrands = makeupProds.map((item) => item.brand);
  let productsTypes = makeupProds.map((item) =>
    item.product_type.split("_").join(" ")
  );
  if (!filterAdded) {
    brandNames = productsBrands
      .filter((item, i) => productsBrands.indexOf(item) === i)
      .sort();
    productTypesNames = productsTypes
      .filter((item, i) => productsTypes.indexOf(item) === i)
      .sort();
  }

  console.log("brandnames", brandNames, productTypesNames);

  console.log(makeupProds, Array.isArray(makeupProds), makeupProds.length);
  if (!makeupProds.length) {
    noItemsPara.style.display = "block"; // if no products found, Display noitems found text
    return;
  }
  row.innerHTML = "";
  console.log(makeupProds);
  makeupProds.forEach((item) => {
    let truncatedDescription =
      item.description.length > 400
        ? `${item.description.substring(0, 400)}...`
        : item.description; //trauncate description if description length is more than 400
    row.innerHTML += `
    <div class="col-12">
        <a class="prodContainer" target="_blank" href=${item.product_link}>
            <img
            class="prodImage"
            alt=${item.name}
            src=${
              item.image_link
                ? item.image_link
                : "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png"
            }
            />
            <div class="details">
                <div class="brandName"><span>Brand</span> : ${item.brand}</div>
                <div class="brandName"><span>Name</span> : ${item.name} ${
      item.product_type ? `(${item.product_type.split("_").join(" ")})` : ""
    }</div>
                <div><span>Price</span> : ${
                  item.price_sign ? item.price_sign : "$"
                } ${item.price}</div>
                <div>${truncatedDescription}</div>
            </div>
        </a>
    </div>`;
  });
}

//Fetching data
async function getItems(brandName, prodType) {
  console.log("prods", brandName, prodType);

  console.log(spinner);
  spinner.style.display = "flex"; // display spinner while data fetching
  noItemsPara.style.display = "none"; // hiding no items found para while fetching
  brandNameInput.setAttribute("disabled", "true"); //disabling filter inputs while fetching data
  prodTypeInput.setAttribute("disabled", true);
  console.log("");
  await fetch(
    `https://makeup-api.herokuapp.com/api/v1/products.json${
      brandName ? "?brand=" + brandName : "?brand="
    }${prodType ? "&product_type=" + prodType : ""}`
    //`http://makeup-api.herokuapp.com/api/v1/products.json?brand=&product_type=lipstick`
  )
    .then((data) => data.json())
    .then((makeupProds) => {
      handleSuccess(makeupProds);
    })
    .catch((err) => {
      console.log("fetcherr", err);
      if (err.message === "Failed to fetch") {
        noItemsPara.style.display = "block";
        spinner.style.display = "none"; // hide spinner after fetch
        noItemsPara.innerText = `${err.message} :(`; //display Fetch failed msg while getting error
      }
      console.log(err);
    });
}
//calling fetch productsas
getItems();
