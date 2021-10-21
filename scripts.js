let container = document.createElement("div");
let row = document.createElement("div");
let brandNames = [];
let productTypes = [];

let filterAddedOnce = false;

document.body.appendChild(container);
container.setAttribute("class", "container");
container.innerHTML = `
        <h1 class="heading">Find Your Makeup Products</h1>
        <form class="searchContainer row" id="filterData">
            <div class="col-12 col-md-6">
            <input
                placeholder="Enter brand name"
                oninput="handleFilterChange()"
                class="searchInput"
                id="brandName"
                value=""
            />
            </div>
            <div class="col-12 col-md-6">
            <input
                placeholder="Enter product type"
                oninput="handleFilterChange()"
                class="searchInput"
                id="productType"
                value=""
            />
            </div>
           
            <a class="waves-effect waves-light btn disabled" id="filterSubmit" onclick="handleFilter()"><i class="material-icons left">filter_list</i>Apply filter</a>
            
        </form>
        <p id="noItems">No items found!!</p>
        <div class="spinnerWrapper">
            <div class="loader"></div>
            <p>Fetching your products</p>
        </div>`;

container.appendChild(row);
row.setAttribute("class", "row");

let brandName = document.getElementById("brandName");
let prodType = document.getElementById("productType");
let spinner = document.querySelector(".spinnerWrapper");
let noItemsPara = document.getElementById("noItems");
let filterForm = document.getElementById("filterData");
let brandsWrapper = document.getElementById("brandsWrapper");

//filterForm.addEventListener("submit", handleFilter);

function handleFilterChange() {
  let filterButton = document.getElementById("filterSubmit");
  if (brandName.value || prodType.value) {
    filterButton.classList.remove("disabled");
  } else if (!brandName.value || !prodType.value || filterAddedOnce) {
    getItems("", "");
    filterButton.classList.add("disabled");
    row.innerHTML = "";
  }
}

function handleFilter() {
  //   if (!brandName.value || !prodType.value) {
  //     alert("Please enter some filter values");
  //     return;
  //   }
  getItems(brandName.value.toLowerCase(), prodType.value.toLowerCase());
  spinner.style.display = "flex";
  noItemsPara.style.display = "none";
  row.innerHTML = "";
  filterAddedOnce = true;
}

function handleSuccess(makeupProds) {
  spinner.style.display = "none";
  let productsBrands = makeupProds.map((item) => item.brand);
  brandNames = productsBrands
    .filter((item, i) => productsBrands.indexOf(item) === i)
    .sort();
  console.log("brandnames", brandNames);

  console.log(makeupProds, Array.isArray(makeupProds), makeupProds.length);
  if (!makeupProds.length) {
    noItemsPara.style.display = "block";
    return;
  }
  row.innerHTML = "";
  console.log(makeupProds);
  makeupProds.forEach((item) => {
    let truncatedDescription =
      item.description.length > 400
        ? `${item.description.substring(0, 400)}...`
        : item.description;
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
                <div><span>Name</span> : ${item.name}</div>
                <div><span>Price</span> : ${
                  item.price_sign ? item.price_sign : "$"
                } ${item.price}</div>
                <div>${truncatedDescription}</div>
            </div>
        </a>
    </div>`;
  });
}

async function getItems(brandName, prodType) {
  console.log("prods", brandName, prodType);

  console.log(spinner);
  spinner.style.display = "flex";
  noItemsPara.style.display = "none";
  console.log("");
  await fetch(
    // `http://makeup-api.herokuapp.com/api/v1/products.json${
    //   brandName ? "?brand=" + brandName : "?brand="
    // }${prodType ? "&product_type=" + prodType : ""}`,
    `http://makeup-api.herokuapp.com/api/v1/products.json`,
    {
      method: "GET",
      //mode: "same-origin",
      //cache: "no-cache",
      //headers: { "Content-Type": "application/json" },
      //referrerPolicy: "unsafe-url",
    }
  )
    .then((data) => data.json())
    .then((makeupProds) => {
      handleSuccess(makeupProds);
    })
    .catch((err) => {
      console.log("fetcherr", err);
      if (err.message === "Failed to fetch") {
        noItemsPara.style.display = "block";
        spinner.style.display = "none";
        noItemsPara.innerText = `${err.message} :(`;
      }
      console.log(err);
    });
}
getItems();
