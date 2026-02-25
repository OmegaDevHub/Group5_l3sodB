/* USERS */
function getUsers(){return JSON.parse(localStorage.getItem("users"))||[]}
function saveUsers(u){localStorage.setItem("users",JSON.stringify(u))}

function register(){
let n=rname.value,e=remail.value,p=rpass.value,c=rcpass.value
let u=getUsers()
if(!n||!e||!p||!c){rmsg.innerText="Fill all";return}
if(u.find(x=>x.email===e)){rmsg.innerText="Email exists";return}
if(p!==c){rmsg.innerText="Mismatch";return}
u.push({name:n,email:e,pass:p})
saveUsers(u)
location="login.html"
}

function login(){
let e=lemail.value,p=lpass.value
let u=getUsers().find(x=>x.email===e&&x.pass===p)
if(!u){lmsg.innerText="Wrong login";return}
localStorage.setItem("logged",JSON.stringify(u))
location="dashboard.html"
}

function logout(){localStorage.removeItem("logged");location="login.html"}

/* DASH */
function initDash(){
let u=JSON.parse(localStorage.getItem("logged"))
if(!u)location="login.html"
uname.innerText=u.name
loadProducts()
}

/* PRODUCTS */
function getP(){return JSON.parse(localStorage.getItem("products"))||[]}
function saveP(p){localStorage.setItem("products",JSON.stringify(p))}

function toggleForm(){
    pform.classList.toggle("hidden");
    // optional: reset form and mode
    pname.value = "";
    pcat.value  = "";
    pqty.value  = "";
    pprice.value= "";
    editingId = null;
    document.querySelector("#addBtn").innerText = "Add Product";
}

let editingId = null;

function addProduct(){
  let n = pname.value;
  let c = pcat.value;
  let q = Number(pqty.value);
  let pr = Number(pprice.value);

  if(!n || !c || q < 0 || isNaN(pr)) return;

  let p = getP();

  if(editingId){ 
    // UPDATE MODE
    let product = p.find(x => x.id === editingId);
    if(product){
      product.name  = n;
      product.cat   = c;
      product.qty   = q;
      product.price = pr;
    }
    editingId = null;
    document.querySelector("#addBtn").innerText = "Add Product";

  }else{
    // ADD MODE
    p.push({
      id:"P"+Date.now(),
      name:n,
      cat:c,
      qty:q,
      price:pr
    });
  }

  saveP(p);
  loadProducts();

  pname.value = "";
  pcat.value  = "";
  pqty.value  = "";
  pprice.value= "";

  // hide form after submit
  pform.classList.add("hidden");
}

function delProduct(id){
let p=getP().filter(x=>x.id!==id)
saveP(p)
loadProducts()
}
function editProduct(id){
  let p = getP();
  let product = p.find(x => x.id === id);
  if(!product) return;

  pname.value  = product.name;
  pcat.value   = product.cat;
  pqty.value   = product.qty;
  pprice.value = product.price;

  editingId = id;

  document.querySelector("#addBtn").innerText = "Update Product";
  pform.classList.remove("hidden");
}

function loadProducts(){
    let p = getP();
    ptable.innerHTML = "";
  
    let ins = 0, out = 0;
  
    if(p.length === 0){
      ptable.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center; padding:20px;">
            No products available
          </td>
        </tr>`;


  
    }
  
    p.forEach(x => {
  
      let statusText  = x.qty > 0 ? "In Stock" : "Out of Stock";
      let statusClass = x.qty > 0 ? "status-in" : "status-out";
  
      if(x.qty > 0) ins++;
      else out++;
  
      ptable.innerHTML += `
        <tr>
          <td>${x.id}</td>
          <td>${x.name}</td>
          <td>${x.cat}</td>
          <td>${x.qty}</td>
          <td>$${x.price}</td>
          <td>
            <span class="${statusClass}">
              ${statusText}
            </span>
          </td>
          <td>
            <button class="delBtn" onclick="delProduct('${x.id}')">
              Delete
            </button>
          </td>
          <td>
            <button class="editBtn" onclick="editProduct('${x.id}')">
              Edit
            </button>
          </td>
        </tr>
      `;
    });
  
    tprod.innerText = p.length;
    inst.innerText  = ins;
    outst.innerText = out;
  }
  function showDashboard(){
    dashboardSection.classList.remove("hidden");
    productSection.classList.add("hidden");

    dashBtn.classList.add("active");
    prodBtn.classList.remove("active");
}

function showProducts(){
    dashboardSection.classList.add("hidden");
    productSection.classList.remove("hidden");

    prodBtn.classList.add("active");
    dashBtn.classList.remove("active");
}

  
