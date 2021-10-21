let container = document.createElement("div");
let row = document.createElement("div");
let brandNames = [];
let productTypes = [];

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
            <div class="buttonsWrapper">
                <a class="waves-effect waves-light btn disabled" id="filterSubmit" onclick="handleApplyFilter()"><i class="material-icons left">filter_list</i>Apply filter</a>
                <a class="waves-effect waves-light btn disabled" id="clearFilter" onclick="handleClearFilter()"><i class="material-icons left">clear_all</i>Clear filter</a>
            </div>
        </form>
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
let brandsWrapper = document.getElementById("brandsWrapper");
let filterButton = document.getElementById("filterSubmit");
let clearFilterButton = document.getElementById("clearFilter");

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
    filterButton.classList.remove("disabled");
    clearFilterButton.classList.remove("disabled");
  } else if (!brandNameInput.value || !prodTypeInput.value) {
    //if value not present, disabling buttons
    //getItems("", "");
    filterButton.classList.add("disabled");
    clearFilterButton.classList.add("disabled");
    row.innerHTML = "";
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

//handling data Once data successfully fetched
function handleSuccess(makeupProds) {
  spinner.style.display = "none"; //hiding spinner after successfull fetch
  brandNameInput.removeAttribute("disabled"); //enabling filter inputs once data sucessfully fetched
  prodTypeInput.removeAttribute("disabled");
  let productsBrands = makeupProds.map((item) => item.brand);
  brandNames = productsBrands
    .filter((item, i) => productsBrands.indexOf(item) === i)
    .sort();
  console.log("brandnames", brandNames);

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
    //`http://makeup-api.herokuapp.com/api/v1/products.json?brand=covergirl&product_type=lipstick`
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
